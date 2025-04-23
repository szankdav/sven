import {
  Collection,
  Message,
  OmitPartialGroupDMChannel,
  User,
} from 'discord.js';
import { logger } from '../../winston/winston.js';
import { DiscordMessage } from '../../logger/types/discordMessage.type.js';
import { messageLoggerHandlerByFunction } from '../../logger/handlers/messageLogger.handler.js';

export async function createMessage(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
) {
  // if (message.author.bot) return;
  // if (message.content.startsWith('<@')) return;
  let messageWithoutMemberId: string = message.content;
  const mentionedUsers: Collection<string, User> = message.mentions.users;

    mentionedUsers.forEach((user, key) => {
      messageWithoutMemberId = messageWithoutMemberId.replace(
        `<@${key}>`,
        user.username,
      );
    });

  const messageData: DiscordMessage = {
    discordId: message.author.id,
    username: message.author.globalName! || message.author.displayName,
    messageCreatedAt: message.createdTimestamp,
    content: messageWithoutMemberId,
  };

  await messageLoggerHandlerByFunction(messageData);

  // await logMessages(messageData);
}

export async function answerBotMention(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
) {
  const user = message.mentions.users.first();
  if (user === undefined) {
    return;
  }
  if (user.username === 'SvenBot') {
    message.channel.send(`Szia ${message.author}!`);
    message.channel.send(
      "Az elérhető parancsaimat a '/' jellel tudod előhozni! :)",
    );
    logger.info(`SvenBot mentioned by: ${message.author}`);
  }
}
