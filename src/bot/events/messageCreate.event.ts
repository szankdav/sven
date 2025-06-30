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

  // for (const user of mentionedUsers) {
  //   messageWithoutMemberId = messageWithoutMemberId.replace(
  //     `<@${user[0]}>`,
  //     user[1].username,
  //   );
  // }

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
  if (message.author.bot) return;
  const user = message.mentions.users.first();
  if (user === undefined) {
    return;
  }
  if (user.username === 'SvenDevBot') {
    message.author.send(`Szia ${message.author.displayName}!`);
    message.author.send(
      "Az elérhető parancsaimat a szerveren a '/' jellel tudod előhozni! :)",
    );
    message.author.send(
      'Közvetlen üzenetben cseveghetsz is velem!',
    );
    logger.info(`SvenDevBot mentioned by: ${message.author}`);
  }
}
