import { CacheType, Client, Guild, Interaction, Message, MessageFlags, MessageReaction, OmitPartialGroupDMChannel, PartialMessageReaction, PartialUser, TextChannel, User } from 'discord.js';
import cron from 'node-cron';
import { getArticleById, getDailyArticles } from './api/forem.service.js';
import { logger } from '../../winston/winston.js';
import { config } from '../../config.js';
import { hikeConversation } from '../commands/texts/conversations.js';
import { getHWSWNews, news } from './api/hwsw.service.js';
import { HWSWNew } from '../types/hwswNew.type.js';
import reactionSwitch from '../client/shared/articlesAndNewsReaction.js';
import { Article } from '../types/foremArticle.type.js';
import { DiscordEvent } from '../interfaces/discordEvent.interface.js';
import ObservableArray from '../utils/observableArray.js';

const discordEvents = new ObservableArray<DiscordEvent>();

export const scheduleDailyArticleMessage = async (bot: Client) => {
    cron.schedule('*/5 * * * *', async () => {
        const user = bot.users.cache.get(config.SZANKDAV_ID);
        const tenForemArticles = await getDailyArticles();
        const tenHWSWArticles = await getHWSWNews();

        if (tenForemArticles === null) {
            logger.error('Could not get articles from forem!');
            return;
        };

        if (tenHWSWArticles === null) {
            logger.error('Could not get news from HWSW!');
            return;
        };

        if (user && tenForemArticles && tenHWSWArticles) {
            await user.send('Jó reggelt! Küldöm a 10 legnépszerűbb cikket a Forem-ről! Kérlek válassz ki öt cikket "szívecskézéssel", amiket szeretnéd, hogy kitegyek a "cikkek" csatornára! A cikkeket csak akkor teszem ki a csatornára, ha kiválasztottad mind az ötöt!');
            for (let i = 0; i < tenForemArticles!.length; i++) {
                // eslint-disable-next-line no-await-in-loop
                await user.send(`Cím: ${tenForemArticles![i].title}\nURL: ${tenForemArticles![i].url}\nLeírás: ${tenForemArticles![i].description}\nCímkék: ${tenForemArticles![i].tags}\nOlvasási idő: ${tenForemArticles![i].reading_time_minutes} perc\nPozitív reakciók: ${tenForemArticles![i].positive_reactions_count}\nPublikálva: ${tenForemArticles![i].readable_publish_date}\nID: ${tenForemArticles![i].id}\n-----------------------------------------------------------------`);
            };
            await user.send('És itt van a HWSW aktuális RSS feedje! Kérlek innes is válassz ki öt hírt "szívecskézéssel", amiket szeretnéd, hogy kitegyek a "hírek" csatornára! A híreket csak akkor teszem ki a csatornára, ha kiválasztottad mind az ötöt!');
            for (let i = 0; i < tenHWSWArticles!.length; i++) {
                const date = new Date(`${tenHWSWArticles[i].isoDate}`);
                // eslint-disable-next-line no-await-in-loop
                await user.send(`Cím: ${tenHWSWArticles[i].title}\nTartalom: ${tenHWSWArticles[i].content}\nLink: ${tenHWSWArticles[i].link}\nDátum: ${date.toLocaleString()}\n-----------------------------------------------------------------`);
            };
        };
    });
};

const fiveChoosenArticles: Array<Article> = [];
export const sendArticlesToTheChannel = async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, client: Client) => {
    reactionSwitch.articleReaction = true;

    if (user.bot) return;

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            logger.error('Failed to catch reaction:', error);
        }
    }

    const admin = reaction.users.cache.get(config.SZANKDAV_ID);

    if (reaction.message.channel.type === 1 && admin && reaction.emoji.name === '❤️') {
        const { content } = reaction.message;
        const match = content?.match(/ID: (\S+)/);
        const id = match?.[1];
        const channel = await client.channels.fetch(config.DEVBOT_CIKKEK_CHANNEL) as TextChannel;
        const article = await getArticleById(id);

        if (article) {
            fiveChoosenArticles.push(article);
        };

        if (fiveChoosenArticles.length === 5) {
            await channel.send('@everyone Sziasztok! Itt van 5 cikk a reggeli mellé, amit szeretnék a figyelmetekbe ajánlani! Jó olvasást! :)');
            fiveChoosenArticles.forEach(async choosenArticle => {
                await channel.send(`${choosenArticle.url}`);
            });
            fiveChoosenArticles.length = 0;
            reactionSwitch.articleReaction = false;
            reactionSwitch.newsReaction = true;
        };
    };
};

const choosenNews: HWSWNew[] = [];
export const sendNewsToTheChannel = async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, client: Client) => {
    if (user.bot) return;

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            logger.error('Failed to catch reaction:', error);
        }
    }

    const admin = reaction.users.cache.get(config.SZANKDAV_ID);

    if (reaction.message.channel.type === 1 && admin && reaction.emoji.name === '❤️') {
        const { content } = reaction.message;
        const match = content?.match(/Cím:\s*(.+)$/m);
        const title = match?.[1];
        const choosenNew: HWSWNew | undefined = news.find(n => n.title === title);
        if (choosenNew) {
            choosenNews.push(choosenNew);
        }
        const channel = await client.channels.fetch(config.DEVBOT_HIREK_CHANNEL) as TextChannel;
        if (choosenNews.length === 5) {
            await channel.send('@everyone Sziasztok! Itt van 5 hír a reggeli mellé, amit szeretnék a figyelmetekbe ajánlani! Jó olvasást! :)');
            choosenNews.forEach(async n => {
                await channel.send(`${n.link}`);
            });
            choosenNews.length = 0;
            news.length = 0;
            reactionSwitch.newsReaction = false;
            reactionSwitch.articleReaction = true;
        };
    };
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