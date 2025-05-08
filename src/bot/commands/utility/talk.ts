import {
  SlashCommandBuilder,
  CommandInteraction,
} from 'discord.js';
import { logger } from '../../../winston/winston.js';
import { hikeConversation } from '../texts/conversations.js';

export const data = new SlashCommandBuilder()
  .setName('talk')
  .setDescription('Sven és Faendal társalog! :)')
  .setDefaultMemberPermissions(0);

export async function execute(interaction: CommandInteraction) {
  await interaction.reply(hikeConversation.sven[0]);
  logger.info(
    `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
  );
};