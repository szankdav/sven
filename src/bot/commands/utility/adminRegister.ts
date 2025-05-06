import {
    SlashCommandBuilder,
    CommandInteraction,
  } from 'discord.js';
  import { logger } from '../../../winston/winston.js';
  
  export const data = new SlashCommandBuilder()
    .setName('registerasadmin')
    .setDescription('Admin fiók regisztrálása a svenbot.cloud oldalhoz.')
    .setDefaultMemberPermissions(0);
  
  export async function execute(interaction: CommandInteraction) {
    await interaction.reply({
       
    });
    
    logger.info(
      `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
    );
  }
  