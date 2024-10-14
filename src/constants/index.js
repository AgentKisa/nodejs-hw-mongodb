import path from 'node:path';

export const accessTokenLifetime = 1000 * 60 * 15; //15 min
export const refreshTokenLifetime = 1000 * 60 * 60 * 24 * 30; //30 days

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
  JWT_SECRET: 'JWT_SECRET',
  APP_DOMAIN: 'APP_DOMAIN',
  IS_CLOUDINARY_ENABLED: 'IS_CLOUDINARY_ENABLED',
};

export const TEMPLATES_PATH = path.join(process.cwd(), 'src', 'templates');
export const TEMP_PATH = path.join(process.cwd(), 'src', 'temp');
export const UPLOAD_PATH = path.join(process.cwd(), 'src', 'upload');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
};
