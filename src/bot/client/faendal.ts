import { Client, Message, OmitPartialGroupDMChannel } from 'discord.js';
import { config } from '../../config.js';
import { cooldownForInteraction } from '../interactions/cooldown.interaction.js';
import { logger } from '../../winston/winston.js';
import { hikeConversation } from '../commands/texts/conversations.js';

export const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages', 'MessageContent'],
});

client.once('ready', async () => {
    /* eslint no-console: ["error", { allow: ["log"] }] */
    console.log('Faendal is ready! 🤖');
    logger.info('Faendal is ready! 🤖');
});

client.on('interactionCreate', async (interaction) => {
  try {
    await cooldownForInteraction(interaction);
  } catch (error) {
    logger.error('Error during set of interactions cooldown: ', { message: error });
  }
});

let sentenceIndex = 0;
async function answerBotConversation(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
) {
  const user = message.mentions.users.first();
  if (user === undefined) {
    return;
  }
  if (user.username === 'Faendal' && message.author.displayName === 'SvenBot') {
    if (sentenceIndex < hikeConversation.faendal.length) {
      if (sentenceIndex === 2) {
        message.channel.send(`${hikeConversation.faendal[sentenceIndex]}`);
        message.channel.send(`${hikeConversation.faendal[sentenceIndex+1]}`);
        sentenceIndex+=1;
      } else if (sentenceIndex === 6) {
        message.channel.send(`${hikeConversation.faendal[sentenceIndex]}`);
        message.channel.send(`${hikeConversation.faendal[sentenceIndex+1]}`);
        message.channel.send(`${hikeConversation.faendal[sentenceIndex+2]}`);
        message.channel.send(`${hikeConversation.faendal[sentenceIndex+3]}`);
        sentenceIndex+=3;
      } else if (sentenceIndex === 10) {
        message.channel.send(`${hikeConversation.faendal[sentenceIndex]}`);
        message.channel.send(`${hikeConversation.faendal[sentenceIndex+1]}`);
        sentenceIndex+=1;
      } else if (sentenceIndex === 12) {
        message.channel.send(`${hikeConversation.faendal[sentenceIndex]}`);
        message.channel.send(`${hikeConversation.faendal[sentenceIndex+1]}`);
        message.channel.send(`${hikeConversation.faendal[sentenceIndex+2]}`);
        sentenceIndex+=2;
      } else if (sentenceIndex === 15) {
        message.channel.send(`${hikeConversation.faendal[sentenceIndex]}`);
        message.channel.send(`${hikeConversation.faendal[sentenceIndex+1]}`);
        sentenceIndex+=1;
      } else {
        message.channel.send(`${hikeConversation.faendal[sentenceIndex]}`);
      }
      sentenceIndex++;
      logger.info(`FaendalDevBot mentioned by: ${message.author}`);
    }
  }
}

client.on('messageCreate', async (message) => {
  try {
    // if (message.author.bot) return;
    // await createMessage(message);
    await answerBotConversation(message);
  } catch (error) {
    logger.error('Error while receiving message from discord: ', { message: error });
  }
});

export function startFaendal() {
  client.login(config.DISCORD_TOKEN_FAENDAL);
}

