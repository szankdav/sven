import {
    SlashCommandBuilder,
    CommandInteraction,
    MessageFlags,
} from 'discord.js';
import { logger } from '../../../winston/winston.js';
import { Context } from '../../states/registration/admin/core/context.js';
import { StartState } from '../../states/registration/admin/start.state.js';

export const context = new Context();

export const data = new SlashCommandBuilder()
    .setName('registerasadmin')
    .setDescription('Admin fiók regisztrálása a svenbot.cloud oldalhoz.')
    .setDefaultMemberPermissions(0);

export async function execute(interaction: CommandInteraction) {
    const startState = new StartState(context, interaction);
    context.setState(startState);
    await context.next();
    await interaction.reply({
        content: 'Küldtem privát üzenetet, melyben a segítségemmel tudsz regisztrálni!',
        flags: MessageFlags.Ephemeral,
    });

    logger.info(
        `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
    );    
}
