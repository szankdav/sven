import { Client } from 'discord.js';
import { config } from '../../config.js';
import { cooldownForInteraction } from '../interactions/cooldown.interaction.js';
import { logger } from '../../winston/winston.js';
import { hikeConversation } from '../commands/texts/conversations.js';

export const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages', 'MessageContent'],
});

client.once('ready', async () => {
  try {
    // await deployCommandsForFaendal();
    /* eslint no-console: ["error", { allow: ["log"] }] */
    console.log('Faendal is ready! 🤖');
    logger.info('Faendal is ready! 🤖');
  } catch (error) {
    logger.error('Error updating application (/) commands for Faendal: ', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    await cooldownForInteraction(interaction);
  } catch (error) {
    logger.error('Error during set of interactions cooldown: ', error);
  }
});

let index = 0;
client.on('messageCreate', async (message) => {
  try {
    // if (message.author.bot) return;
    if (message.author.bot && message.author.displayName === 'SvenDevBot' && message.content.includes('<@1363775791904718920>') && index < hikeConversation.faendal.length) {
      do {
        // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
        await new Promise(r => setTimeout(r, Math.random() * (5000 - 1500 + 1) + 1500));
        message.channel.send(hikeConversation.faendal[index]);
        index++;
      } while (!hikeConversation.faendal[index - 1].includes('<@1352273717623001209>'));
    }
  } catch (error) {
    logger.error('Error while receiving message from discord: ', error);
  }
});

export function startFaendal() {
  client.login(config.DISCORD_TOKEN_FAENDAL_DEV);
}
