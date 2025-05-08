import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { logger } from '../../../winston/winston.js';

export const data = new SlashCommandBuilder()
  .setName('user')
  .setDescription('Információk a felhasználóról');

export async function execute(interaction: CommandInteraction) {
  // interaction.user egy User object, aki futtatta a parancsot
  // interaction.member egy GuildMember object, ami a usert reprezentálja a szerveren
  logger.info(
    `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
  );
  return interaction.reply(`Felhasználóneved: ${interaction.user}.`);
}
