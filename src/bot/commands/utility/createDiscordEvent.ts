import {
    SlashCommandBuilder,
    CommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
} from 'discord.js';
import { logger } from '../../../winston/winston.js';

export const data = new SlashCommandBuilder()
    .setName('create_event')
    .setDescription('Esemény létrehozása');

export async function execute(interaction: CommandInteraction) {
    try {
        const modal = new ModalBuilder()
            .setCustomId('eventModal')
            .setTitle('Esemény létrehozása');

        const eventNameInput = new TextInputBuilder()
            .setCustomId('eventNameInput')
            .setLabel('Esemény neve:')
            .setStyle(TextInputStyle.Short);

        const eventContentInput = new TextInputBuilder()
            .setCustomId('eventContentInput')
            .setLabel('Mi várható az eseményen?')
            .setStyle(TextInputStyle.Paragraph);

        const eventDateInput = new TextInputBuilder()
            .setCustomId('eventDateInput')
            .setLabel('Mikor legyen az esemény? (ÉÉÉÉ-HH-NN/ÓÓ:PP)')
            .setStyle(TextInputStyle.Short);

        const eventEntityTypeInput = new TextInputBuilder()
            .setCustomId('eventEntityTypeInput')
            .setLabel('Esemény helye: (1: stage, 2: hangcsatorna)')
            .setStyle(TextInputStyle.Short);

        const eventChannelInput = new TextInputBuilder()
            .setCustomId('eventChannelInput')
            .setLabel('Ha hangcsatornán akkor kérlek írd be a nevét:')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(eventNameInput);
        const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(eventContentInput);
        const thirdActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(eventDateInput);
        const fourthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(eventEntityTypeInput);
        const fifthActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(eventChannelInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

        await interaction.showModal(modal);

        logger.info(
            `Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`,
        );
    } catch (error) {
        logger.error('Error during create_event command: ', error);
    }
};