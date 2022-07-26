import { config } from 'dotenv';
import { Logger } from '../utils';
import path from 'path';
config();
export const PUBLIC_DIR = path.join(__dirname, '../../public');
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN as string;
export const PORT = process.env.PORT as string;
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN as string;
export const DB_URI = process.env.DB_URI as string;
export const DB_NAME = process.env.DB_NAME as string;
export const SKIP_VALIDATION = process.env.SKIP_VALIDATION === 'true';
export const SALT_WORK_FACTOR = Number(process.env.SALT_WORK_FACTOR);
export const WEBSOCKET_SERVER_URL = process.env.WEBSOCKET_SERVER_URL as string;
export const WEBSOCKET_SERVER_KEY = process.env.WEBSOCKET_SERVER_KEY as string;

export default {
  verify: function () {
    if (!PORT) {
      throw new Error(`PORT is not defined`);
    }
    if (!DB_URI) {
      throw new Error('DB_URI is not defined');
    }
    if (!DB_NAME) {
      throw new Error('DB_NAME is not defined');
    }
    if (!ACCESS_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    if (!ACCESS_TOKEN_EXPIRES_IN) {
      throw new Error('ACCESS_TOKEN_EXPIRES_IN is not defined');
    }
    if (!FRONTEND_ORIGIN) {
      throw new Error('FRONTEND_ORIGIN is not defined');
    }
    if (SKIP_VALIDATION !== true && SKIP_VALIDATION !== false) {
      throw new Error('SKIP_VALIDATION is not defined');
    }
    if (SALT_WORK_FACTOR < 1) {
      throw new Error('SALT_WORK_FACTOR is not defined');
    }
    if (!WEBSOCKET_SERVER_URL) {
      throw new Error('WEBSOCKET_SERVER_URL is not defined');
    }
    if (!WEBSOCKET_SERVER_KEY) {
      throw new Error('WEBSOCKET_SERVER_KEY is not defined');
    }
    Logger.info(`Environment variables are set correctly`);
  }
};
