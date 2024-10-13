import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import crypto from 'node:crypto';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendMail } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const salt = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({ ...payload, password: salt });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(24).toString('base64');
  const refreshToken = crypto.randomBytes(24).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + accessTokenLifetime),
    refreshTokenValidUntil: new Date(Date.now() + refreshTokenLifetime),
  });
};

export const logoutUser = async (sessionId, sessionToken) => {
  await SessionsCollection.deleteOne({
    _id: sessionId,
  });
};

const createSession = () => {
  const accessToken = crypto.randomBytes(24).toString('base64');
  const refreshToken = crypto.randomBytes(24).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + accessTokenLifetime),
    refreshTokenValidUntil: new Date(Date.now() + refreshTokenLifetime),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken: refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(SMTP.JWT_SECRET),
    {
      expiresIn: 60 * 15, //15 minutes,
    },
  );

  const resetLink = `${env(
    SMTP.APP_DOMAIN,
  )}/reset-password?token=${resetToken}`;
  try {
    await sendMail({
      to: email,
      from: env(SMTP.SMTP_FROM),
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password!</p>`,
      subject: 'Reset your password!',
    });
  } catch (err) {
    console.log(err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let payload;
  try {
    payload = jwt.verify(token, env(SMTP.JWT_SECRET));
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
  const user = await UsersCollection.findById(payload.sub);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await UsersCollection.findByIdAndUpdate(user._id, {
    password: hashedPassword,
  });
  await SessionsCollection.deleteOne({ userId: user._id });
};
