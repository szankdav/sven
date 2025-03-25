import {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  MessageFlags,
  CommandInteraction,
} from 'discord.js';
import { logger } from '../../../winston/winston.js';

export const data = new SlashCommandBuilder()
  .setName('echo')
  .setDescription('Replies with your input!')
  .addUserOption((option) =>
    option.setName('user').setDescription('The text that writed'),
  )
  .addStringOption((option) =>
    option
      .setName('input')
      .setDescription('The input to echo back')
      .setMaxLength(2000),
  )
  .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('The channel to echo into')
      // Csak TextChannel lehet az output
      .addChannelTypes(ChannelType.GuildText),
  )
  .addBooleanOption((option) =>
    option
      .setName('embed')
      .setDescription('Whether or not the echo should be embedded'),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: CommandInteraction) {
  const text = interaction.options.get('input')?.value ?? 'Nem írt be semmit.';
  const embedded = interaction.options.get('embed') ?? false;
  const { user } = interaction;
  if (!embedded) {
    await interaction.reply(
      `A megadott szöveg: ${text}, aki beírta: ${user.username}`,
    );
  } else {
    await interaction.reply({
      content: `A megadott szöveg: ${text}`,
      flags: MessageFlags.Ephemeral,
    });
  }
  logger.info(
    `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
  );
}
