import {
  Collection,
  Message,
  OmitPartialGroupDMChannel,
  User,
} from "discord.js";
import { logger } from "../../winston/winston.js";
import { DiscordMessage } from "../../logger/types/discordMessage.type.js";
import { logMessages } from "../services/api/logger.js";

export async function createMessage(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
) {
  try {
    if (message.author.bot) return;
    if (message.content.startsWith("<@")) return;
    let messageWithoutMemberId: string = message.content;
    const mentionedUsers: Collection<string, User> = message.mentions.users;
    for (const user of mentionedUsers) {
      messageWithoutMemberId = messageWithoutMemberId.replace(
        `<@${user[0]}>`,
        user[1].username,
      );
    }

    const messageData: DiscordMessage = {
      discordId: message.author.id,
      username: message.author.globalName!,
      messageCreatedAt: message.createdTimestamp,
      content: messageWithoutMemberId,
    };

    //await messageLoggerHandlerByFunction(messageData);

    await logMessages(messageData);
  } catch (error) {
    logger.error("Error creating message:", error);
  }
}

export async function answerBotMention(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
) {
  if (message.author.bot) return;
  const user = message.mentions.users.first();
  if (user === undefined) {
    return;
  }
  if (user.username === "SVS-Sven") {
    message.channel.send(`Szia ${message.author}!`);
    message.channel.send(
      "Az elérhető parancsaimat a '/' jellel tudod előhozni! :)",
    );
    logger.info(`SVSimulator Sven mentioned by: ${message.author}`);
  }
}
