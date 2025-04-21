// import {
//     SlashCommandBuilder,
//     MessageFlags,
//     CommandInteraction,
//   } from 'discord.js';
// import { fakerHU } from '@faker-js/faker/.';
//   import { logger } from '../../../winston/winston.js';
  
//   export const data = new SlashCommandBuilder()
//     .setName('talk')
//     .setDescription('Sven és Faendal társalog! :)');
  
//   export async function execute(interaction: CommandInteraction) {
//     await interaction.reply({
//       content: fakerHU.lorem.sentences(), // mert dev dependency
//       flags: MessageFlags.Ephemeral,
//     });
//     logger.info(
//       `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
//     );
//   }
  