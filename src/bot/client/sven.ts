import { Client, Message, OmitPartialGroupDMChannel } from 'discord.js';
import { config } from '../../config.js';
import { deployCommandsForSven } from './deploy-commands.js';
import { cooldownForInteraction } from '../interactions/cooldown.interaction.js';
import {
  createMessage,
  answerBotMention,
} from '../events/messageCreate.event.js';
import { logger } from '../../winston/winston.js';
import { hikeConversation } from '../commands/texts/conversations.js';

export const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages', 'MessageContent'],
});

client.once('ready', async () => {
  try {
    await deployCommandsForSven();
    /* eslint no-console: ["error", { allow: ["log"] }] */
    console.log('Sven is ready! 🤖');
    logger.info('Sven is ready! 🤖');
  } catch (error) {
    logger.error('Error updating application (/) commands: ', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    await cooldownForInteraction(interaction);
  } catch (error) {
    logger.error('Error during set of interactions cooldown: ', error);
  }
});

let sentenceIndex = 1;
async function answerBotConversation(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
) {
  const user = message.mentions.users.first();
  if (user === undefined) {
    return;
  }
  if (user.username === 'SvenDevBot' && message.author.displayName === 'FaendalDevBot') {
    if (sentenceIndex <= hikeConversation.faendal.length) {
      if (sentenceIndex === 2) {
        message.channel.send(`${hikeConversation.sven[sentenceIndex]}`);
        message.channel.send(`${hikeConversation.sven[sentenceIndex + 1]}`);
        sentenceIndex += 1;
      } else if (sentenceIndex === 6) {
        message.channel.send(`${hikeConversation.sven[sentenceIndex]}`);
        message.channel.send(`${hikeConversation.sven[sentenceIndex + 1]}`);
        message.channel.send(`${hikeConversation.sven[sentenceIndex + 2]}`);
        message.channel.send(`${hikeConversation.sven[sentenceIndex + 3]}`);
        sentenceIndex += 3;
      } else if (sentenceIndex === 10) {
        message.channel.send(`${hikeConversation.sven[sentenceIndex]}`);
        message.channel.send(`${hikeConversation.sven[sentenceIndex + 1]}`);
        message.channel.send(`${hikeConversation.sven[sentenceIndex + 2]}`);
        sentenceIndex += 2;
      } else if (sentenceIndex === 13) {
        message.channel.send(`${hikeConversation.sven[sentenceIndex]}`);
        message.channel.send(`${hikeConversation.sven[sentenceIndex + 1]}`);
        sentenceIndex += 1;
      } else if (sentenceIndex === 15) {
        message.channel.send(`${hikeConversation.sven[sentenceIndex]}`);
        message.channel.send(`${hikeConversation.sven[sentenceIndex + 1]}`);
        sentenceIndex += 1;
      } else if (sentenceIndex === 17) {
        message.channel.send(`${hikeConversation.sven[sentenceIndex]}`);
        message.channel.send(`${hikeConversation.sven[sentenceIndex + 1]}`);
        sentenceIndex += 1;
      } else {
        message.channel.send(`${hikeConversation.sven[sentenceIndex]}`);
      }
      sentenceIndex++;
      logger.info(`SvenDevBot mentioned by: ${message.author}`);
    }
  }
}

client.on('messageCreate', async (message) => {
  try {
    // if (message.author.bot) return;
    if (message.flags.has('Ephemeral')) return; // tegyunk minden bot uzenetet Ephemeral-ra, amit nem szeretnenk logolni
    await createMessage(message);
    await answerBotMention(message);
    await answerBotConversation(message);
  } catch (error) {
    logger.error('Error while receiving message from discord: ', error);
  }
});

export function startSven() {
  client.login(config.DISCORD_TOKEN_SVEN_DEV);
}