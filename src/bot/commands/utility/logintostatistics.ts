import {
    SlashCommandBuilder,
    CommandInteraction,
    MessageFlags,
} from 'discord.js';
import { logger } from '../../../winston/winston.js';

export const server = { name: '' };

export const data = new SlashCommandBuilder()
    .setName('logintostatisticspage')
    .setDescription('Bejelentkezés a statisztikai adatok oldalára.')
    .setDefaultMemberPermissions(0);

export async function execute(interaction: CommandInteraction) {
    server.name = interaction.guild?.name as string;
    await interaction.user.send('Szia! Ezen a linken be tudsz jelentkezni, hogy lásd a szervered statisztikai adatait:');
    await interaction.user.send('https://discord.com/oauth2/authorize?client_id=1352273717623001209&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=identify');
    await interaction.reply({
        content: 'Küldtem privát üzenetet!',
        flags: MessageFlags.Ephemeral,
    });
    logger.info(
        `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
    );
}
