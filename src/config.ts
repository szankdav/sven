import dotenv from 'dotenv';
import { logger } from './winston/winston.js';

dotenv.config();

const { DISCORD_TOKEN_SVEN, DISCORD_TOKEN_FAENDAL, DISCORD_CLIENT_SVEN_ID, DISCORD_CLIENT_FAENDAL_ID, GUILD_ID, DB_PATH, DISCORD_CLIENT_SVEN_SECRET } = process.env;

if (!DISCORD_TOKEN_SVEN || !DISCORD_TOKEN_FAENDAL || !DISCORD_CLIENT_SVEN_ID || !DISCORD_CLIENT_FAENDAL_ID || !GUILD_ID || !DISCORD_CLIENT_SVEN_SECRET) {
  logger.error('Missing environment variables');
  throw new Error('Missing environment variables');
}

export const config = {
  DISCORD_TOKEN_SVEN,
  DISCORD_TOKEN_FAENDAL,
  DISCORD_CLIENT_SVEN_ID,
  DISCORD_CLIENT_FAENDAL_ID,
  GUILD_ID,
  DB_PATH,
  DISCORD_CLIENT_SVEN_SECRET
};
