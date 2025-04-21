// import { Client } from 'discord.js';
// import { config } from '../../config.js';
// import { deployCommands } from './deploy-commands.js';
// import { cooldownForInteraction } from '../interactions/cooldown.interaction.js';
// import {
//   createMessage,
//   answerBotMention,
// } from '../events/messageCreate.event.js';
// import { logger } from '../../winston/winston.js';

// export const client = new Client({
//   intents: ['Guilds', 'GuildMessages', 'DirectMessages', 'MessageContent'],
// });

// client.once('ready', async () => {
//   try {
//     await deployCommands();
//     /* eslint no-console: ["error", { allow: ["log"] }] */
//     console.log('Faendal is ready! 🤖');
//     logger.info('Faendal is ready! 🤖');
//   } catch (error) {
//     logger.error('Error updating application (/) commands: ', error);
//   }
// });

// client.on('interactionCreate', async (interaction) => {
//   try {
//     await cooldownForInteraction(interaction);
//   } catch (error) {
//     logger.error('Error during set of interactions cooldown: ', error);
//   }
// });

// client.on('messageCreate', async (message) => {
//   try {
//     if (message.author.bot) return;
//     await createMessage(message);
//     await answerBotMention(message);
//   } catch (error) {
//     logger.error('Error while receiving message from discord: ', error);
//   }
// });

// export function startFaendal() {
//   client.login(config.DISCORD_TOKEN_DEV);
// }
