import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { logger } from '../../../winston/winston.js';

export const data = new SlashCommandBuilder()
  .setName('server')
  .setDescription('Alapinformációk a szerverről');

export async function execute(interaction: CommandInteraction) {
  // interaction.guild egy object ami a szervert reprezentálja, ahol a parancs futott
  await interaction.reply(
    `Szerver neve: ${interaction.guild?.name}, tagjainak száma: ${interaction.guild?.memberCount}.`,
  );
  logger.info(
    `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
  );
}
