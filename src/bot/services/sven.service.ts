import { CacheType, Client, Collection, Guild, Interaction, Message, MessageFlags, MessageReaction, OmitPartialGroupDMChannel, PartialMessageReaction, PartialUser, TextChannel, User } from 'discord.js';
import cron from 'node-cron';
import { logger } from '../../winston/winston.js';
import { config } from '../../config.js';
import { hikeConversation } from '../commands/texts/conversations.js';
import { DiscordEvent } from '../interfaces/discordEvent.interface.js';
import ObservableArray from '../utils/observableArray.js';
import canChoose from '../client/shared/canChoose.js';
import { filterAlreadyPublishedNewsAndArticles, sendNewsAndArticlesToAdmin } from './publish.service.js';

const discordEvents = new ObservableArray<DiscordEvent>();

const getChannelMessages = async (channelId: string, bot: Client): Promise<Collection<string, Message<true>>> => {
    const channel = await bot.channels.fetch(channelId) as TextChannel;
    const channelMessages = await channel.messages.fetch();

    return channelMessages;
};

export const scheduleDailyArticleMessage = async (bot: Client) => {
    cron.schedule('*/2 * * * *', async () => {
        canChoose.canChooseArticle = true;
        canChoose.canChooseHWSWNew = true;
        const user = bot.users.cache.get(config.SZANKDAV_ID);
        const articlesChannelMessages = await getChannelMessages(config.DEVBOT_CIKKEK_CHANNEL, bot);
        const newsChannelMessages = await getChannelMessages(config.DEVBOT_HIREK_CHANNEL, bot);
        await filterAlreadyPublishedNewsAndArticles(articlesChannelMessages, newsChannelMessages);
        await sendNewsAndArticlesToAdmin(user);
    });
};

let index = 1;
export const talkWithFaendal = async (message: OmitPartialGroupDMChannel<Message<boolean>>) => {
    try {
        if (message.author.bot && message.author.displayName === 'FaendalDevBot' && message.content.includes('<@1352273717623001209>') && index < hikeConversation.sven.length) {
            do {
                // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
                await new Promise(r => setTimeout(r, Math.random() * (5000 - 1500 + 1) + 1500));
                message.channel.send(hikeConversation.sven[index]);
                index++;
            } while (!hikeConversation.sven[index - 1].includes('<@1363775791904718920>'));
        }
    } catch (error) {
        logger.error('Error during conversation with Faendal: ', error);
    }
};

export const createNewDiscordEvent = async (interaction: Interaction<CacheType>, bot: Client) => {
    try {
        if (!interaction.isModalSubmit()) { return; };
        const admin = bot.users.cache.get(config.SZANKDAV_ID);
        const { user } = interaction;
        const title = interaction.fields.getTextInputValue('eventNameInput');
        const description = interaction.fields.getTextInputValue('eventContentInput');
        const date = interaction.fields.getTextInputValue('eventDateInput').split('/');
        // const time = interaction.fields.getTextInputValue('eventTimeInput');
        const entity = interaction.fields.getTextInputValue('eventEntityTypeInput');
        const choosenChannel = interaction.fields.getTextInputValue('eventChannelInput');
        const dateTimeString = `${date[0]}T${date[1]}`;
        const parsedDate = new Date(new Date(dateTimeString).toLocaleString());
        const isValidDate = !Number.isNaN(parsedDate.getTime());
        const isPassedDate = parsedDate.getTime() < Date.now();
        let validChannel;

        if (!isValidDate) {
            await interaction.reply({ content: 'Hibás dátumformátum! Kérlek a dátumot így írd be: `ÉÉÉÉ-HH-NN/ÓÓ:PP`', flags: MessageFlags.Ephemeral });
            return;
        };

        if (isPassedDate) {
            await interaction.reply({ content: 'Hibás dátum! A dátum amit megadtál, már a múlté. :)', flags: MessageFlags.Ephemeral });
            return;
        }

        if (Number.isNaN(entity) || (entity !== '1' && entity !== '2')) {
            await interaction.reply({ content: 'Hibás eseményszám! Kérlek csak 1-es vagy 2-es szám beírásával válaszolj!', flags: MessageFlags.Ephemeral });
            return;
        };

        if (entity === '2' && choosenChannel.length === 0) {
            await interaction.reply({ content: 'Nem adtad meg a hangcsatorna nevét, ahol szeretnéd, hogy legyen az esemény!', flags: MessageFlags.Ephemeral });
            return;
        };

        if (choosenChannel.length > 0) {
            const guild = await bot.guilds.fetch(config.GUILD_ID_DEV);
            const channels = await guild.channels.fetch();
            validChannel = channels.find(ch => ch?.name === choosenChannel);

            if (!validChannel) {
                await interaction.reply({ content: 'Hibás csatorna! Kérlek a csatorna nevét pontosan úgy írd be, ahogy a szerveren látod!', flags: MessageFlags.Ephemeral });
                return;
            }
        };

        const event: DiscordEvent = {
            title,
            description,
            date: parsedDate,
            entityType: entity,
            channel: validChannel?.id || undefined,
            owner: user,
        };

        discordEvents.on('push', async (item: DiscordEvent) => {
            if (admin) {
                await admin.send(`Szia! Új eseményt szeretne létrehozni ${item.owner.displayName}. Az esemény adatai:\nCím: ${item.title}\nLeírás: ${item.description}\nDátum, amikor szeretné: ${item.date.toLocaleString()}\nHa minden megfelel, nyomj egy 👍 jelet, ha nem, akkor egy 👎 jelet, és értesítem a felhasználót, hogy mi volt a hiba.`);
            };
        });

        discordEvents.push(event);

        if (interaction.customId === 'eventModal') {
            await interaction.reply({ content: 'Köszönjük! Egy admin ellenőrizni fogja az eseményedet, és ha mindent rendben talál, akkor hamarosan megjelenik az események között!', flags: MessageFlags.Ephemeral });
        }
    } catch (error) {
        logger.error('Error creating new Discord event: ', error);
    }
};

const createEvent = async (event: DiscordEvent, guild: Guild) => {
    const createdEvent = await guild.scheduledEvents.create({
        name: event.title,
        scheduledStartTime: event.date,
        privacyLevel: 2,
        entityType: Number(event.entityType),
        channel: event.channel || undefined,
        description: event.description,
        image: null,
    });

    return createdEvent;
};

export const judgeNewDiscordEvent = async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, client: Client) => {
    if (user.bot) return;

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            logger.error('Failed to catch reaction:', error);
        }
    }

    const admin = reaction.users.cache.get(config.SZANKDAV_ID);

    if (reaction.message.channel.type === 1 && admin && reaction.emoji.name === '👍') {
        const { content } = reaction.message;
        const match = content?.match(/Cím:\s*(.+)$/m);
        const title = match?.[1];
        if (title) {
            const guild = await client.guilds.fetch(config.GUILD_ID_DEV);
            const approvedDiscordEvent: DiscordEvent | undefined = discordEvents.getAll().find(e => e.title === title);
            if (approvedDiscordEvent) {
                const createdEvent = await createEvent(approvedDiscordEvent, guild);
                await approvedDiscordEvent.owner.send('Az eseményedet jóváhagyták! 🥳');
                await approvedDiscordEvent.owner.send(`Ha gondolod, oszd meg: ${createdEvent.url}`);
                discordEvents.deleteByString(title);
            };
        };
    };
};