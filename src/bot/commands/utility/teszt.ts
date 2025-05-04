import {
  SlashCommandBuilder,
  MessageFlags,
  CommandInteraction,
} from 'discord.js';
import { logger } from '../../../winston/winston.js';

export const data = new SlashCommandBuilder()
  .setName('teszt')
  .setDescription('Teszt parancs.')
  .setDefaultMemberPermissions(0);

export async function execute(interaction: CommandInteraction) {
  await interaction.reply({
    content: 'Sikeres teszt, minden rendben működik! :)',
    flags: MessageFlags.Ephemeral,
  });
  logger.info(
    `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
  );
}
