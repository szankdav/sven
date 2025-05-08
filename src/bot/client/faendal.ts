import { Client } from 'discord.js';
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

let index = 0;
client.on('messageCreate', async (message) => {
  try {
    // if (message.author.bot) return;
    if (message.author.bot && message.author.displayName === 'SvenBot' && message.content.includes('<@1364591874404257903>') && index < hikeConversation.faendal.length) {
      do {
        // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
        await new Promise(r => setTimeout(r, Math.random() * (5000 - 1500 + 1) + 1500));
        message.channel.send(hikeConversation.faendal[index]);
        index++;
      } while (!hikeConversation.faendal[index - 1].includes('<@1352271959232086026>'));
    }
  } catch (error) {
    logger.error('Error while receiving message from discord: ', { message: error });
  }
});

export function startFaendal() {
  client.login(config.DISCORD_TOKEN_FAENDAL);
}
