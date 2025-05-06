import dotenv from 'dotenv';
import { logger } from './winston/winston.js';

dotenv.config();

const { DISCORD_TOKEN_SVEN_DEV, DISCORD_TOKEN_FAENDAL_DEV, DISCORD_CLIENT_SVEN_ID_DEV, DISCORD_CLIENT_FAENDAL_ID_DEV, GUILD_ID_DEV, DB_PATH, ADMINS_DB_PATH } =
  process.env;

if (!DISCORD_TOKEN_SVEN_DEV || !DISCORD_TOKEN_FAENDAL_DEV || !DISCORD_CLIENT_SVEN_ID_DEV || !DISCORD_CLIENT_FAENDAL_ID_DEV || !GUILD_ID_DEV) {
  logger.error('Missing environment variables');
  throw new Error('Missing environment variables');
}

export const config = {
  DISCORD_TOKEN_SVEN_DEV,
  DISCORD_TOKEN_FAENDAL_DEV,
  DISCORD_CLIENT_SVEN_ID_DEV,
  DISCORD_CLIENT_FAENDAL_ID_DEV,
  GUILD_ID_DEV,
  DB_PATH,
  ADMINS_DB_PATH,
};
