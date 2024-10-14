import { SMTP } from '../constants/index.js';
import { env } from './env.js';
import { saveImageLocally } from './saveImageLocally.js';
import { saveFileToCloudinary } from './saveFileToCloudinary.js';

export const saveImage = async (file) => {
  if (env(SMTP.IS_CLOUDINARY_ENABLED) === 'true') {
    return await saveFileToCloudinary(file);
  } else {
    return await saveImageLocally(file);
  }
};
