import { Client, Message, OmitPartialGroupDMChannel } from 'discord.js';
import { config } from '../../config.js';
import { cooldownForInteraction } from '../interactions/cooldown.interaction.js';
import { logger } from '../../winston/winston.js';
import { talkWithSven } from '../services/faendal.service.js';

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

client.on('messageCreate', async (message: OmitPartialGroupDMChannel<Message<boolean>>) => {
  await talkWithSven(message);
});

export function startFaendal() {
  client.login(config.DISCORD_TOKEN_FAENDAL_DEV);
}
