import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { UPLOAD_PATH } from './constants/index.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(UPLOAD_PATH);
  setupServer();
};

bootstrap();
