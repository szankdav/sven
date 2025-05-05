import { logger } from '../../../winston/winston.js';
import { DiscordMessage } from '../../../logger/types/discordMessage.type';

export const logMessages = async (messageData: DiscordMessage) => {
  const result = await fetch('/logMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: messageData }),
  });

  if (result.status === 200) {
    logger.info(`Message logged by user: ${messageData.username}`);
  } else {
    const errorText = await result.text();
    logger.error(`Failed to log message: ${result.status} - ${errorText}`);
  }
};
