import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js';

export const createAcceptButtonForNewsAndArticles = (id: number, type: string) => {
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`accept_${id}_${type}`)
                .setLabel('Mehet')
                .setStyle(ButtonStyle.Success),
        );

    return row;
};

export const createCancelButtonForNewsAndArticles = (id: number, type: string) => {
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`cancel_${id}_${type}`)
                .setLabel('Mégse')
                .setStyle(ButtonStyle.Danger),
        );

    return row;
};

export const createDoneButtonForNewsAndArticles = (type: string) => {
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`done_${type}`)
                .setLabel('Kész')
                .setStyle(ButtonStyle.Success),
        );

    return row;
};

export const disableButton = async (interaction: ButtonInteraction, cancelButton?: ActionRowBuilder<ButtonBuilder>) => {
    const updatedRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            ButtonBuilder.from(interaction.component).setDisabled(true)
        );

    if (cancelButton) {
        await interaction.message.edit({
            components: [updatedRow, cancelButton],
        });
        return;
    }

    await interaction.message.edit({
        components: [updatedRow],
    });
};