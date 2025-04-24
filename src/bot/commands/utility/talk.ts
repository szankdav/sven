import {
  SlashCommandBuilder,
  CommandInteraction,
} from 'discord.js';
import { logger } from '../../../winston/winston.js';
import { hikeConversation } from '../texts/conversations.js';

export const data = new SlashCommandBuilder()
  .setName('talk')
  .setDescription('Sven és Faendal társalog! :)')
  .addNumberOption((option) => option.setName('valasszon')
    .setDescription('Bakonyi kirándulás - 1'));

export async function execute(interaction: CommandInteraction) {
  const choosenOption = interaction.options.get('valasszon')?.value;
  if (choosenOption === 1) {
    await interaction.reply({
      content: hikeConversation.sven[0]
    });
  }
  logger.info(
    `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
  );
}
