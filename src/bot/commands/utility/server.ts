import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { logger } from '../../../winston/winston.js';

export const data = new SlashCommandBuilder()
  .setName('server')
  .setDescription('Provides information about the server.');
export async function execute(interaction: CommandInteraction) {
  // interaction.guild egy object ami a szervert reprezentálja, ahol a parancs futott
  await interaction.reply(
    `This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`,
  );
  logger.info(
    `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
  );
}
