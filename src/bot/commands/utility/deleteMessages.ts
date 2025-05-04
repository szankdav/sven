import {
    SlashCommandBuilder,
    CommandInteraction,
    TextChannel,
  } from 'discord.js';
  import { logger } from '../../../winston/winston.js';
import { deleteAllAuthors } from '../../../logger/model/author.model.js';
import { db } from '../../../logger/database/database.js';
  
  export const data = new SlashCommandBuilder()
    .setName('deletemessages')
    .setDescription('!!!!FIGYELEM!!!! A csatorna, és az adatbázisban tárolt összes üzenet törlése !!!!FIGYELEM!!!!')
    .setDefaultMemberPermissions(0);

  export async function execute(interaction: CommandInteraction) {
    const channelParent = await interaction.channel?.fetch();
    const channelProps: TextChannel = channelParent?.toJSON() as TextChannel;
    await interaction.channel?.delete();
    await interaction.guild?.channels.create({
        name: 'általános',
        type: 0,
        parent: channelProps.parentId,
    });
    await deleteAllAuthors(db);
    logger.info(
      `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
    );
  }
  