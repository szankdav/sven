import {
    SlashCommandBuilder,
    CommandInteraction,
    TextChannel,
  } from 'discord.js';
  import { logger } from '../../../winston/winston.js';
  
  export const data = new SlashCommandBuilder()
    .setName('deletemessages')
    .setDescription('A csatorna összes üzenetének törlése)')
    .setDefaultMemberPermissions(0)
  
  export async function execute(interaction: CommandInteraction) {
    const channelParent = await interaction.channel?.fetch();
    const channelProps: TextChannel = channelParent?.toJSON() as TextChannel;
    await interaction.channel?.delete();
    await interaction.guild?.channels.create({
        name: 'általános',
        type: 0,
        parent: channelProps['parentId'],
    })
    logger.info(
      `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
    );
  }
  