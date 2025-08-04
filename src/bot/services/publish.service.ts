import { ButtonInteraction, CacheType, Client, Collection, Message, TextChannel, User } from 'discord.js';
import { getArticleById, getDailyArticles } from './api/forem.service.js';
import { getHWSWNews, news } from './api/hwsw.service.js';
import { logger } from '../../winston/winston.js';
import { createAcceptButtonForNewsAndArticles, createCancelButtonForNewsAndArticles, createDoneButtonForNewsAndArticles, disableButton } from '../utils/discordButtons.util.js';
import { config } from '../../config.js';
import { Article } from '../types/foremArticle.type.js';
import { HWSWNew } from '../types/hwswNew.type.js';
import canChoose from '../client/shared/canChoose.js';

let tenForemArticles: Article[] | null = [];
let tenHWSWNews: HWSWNew[] | null = [];
const choosenArticles: Array<Article> = [];
const choosenNews: HWSWNew[] = [];

export const initializeArticlesAndNewsArrays = async () => {
    tenForemArticles = await getDailyArticles();
    tenHWSWNews = await getHWSWNews();
};

export const getArticleArray = () => tenForemArticles;
export const getNewsArray = () => tenHWSWNews;

export const filterAlreadyPublishedNewsAndArticles = async (articlesChannelMessages: Collection<string, Message<true>>, newsChannelMessages: Collection<string, Message<true>>) => {
    if (tenForemArticles === null) {
        logger.error('Could not get articles from forem!');
        return;
    };

    if (tenHWSWNews === null) {
        logger.error('Could not get news from HWSW!');
        return;
    };

    const articlesChannelMessagesArray = Array.from(articlesChannelMessages);
    tenForemArticles = tenForemArticles?.filter(article => {
        const match = articlesChannelMessagesArray.find(message =>
            message[1].content.includes(article.url)
        );
        return !match;
    }) ?? null;

    const newsChannelMessagesArray = Array.from(newsChannelMessages);
    tenHWSWNews = tenHWSWNews?.filter(hwswNew => {
        const match = newsChannelMessagesArray.find(message =>
            message[1].content.includes(hwswNew.link)
        );
        return !match;
    }) ?? null;
};

export const sendNewsAndArticlesToAdmin = async (user: User | undefined) => {
    if (user && tenForemArticles && tenHWSWNews) {
        if (tenForemArticles.length === 0) {
            await user.send('Sajnos ma semmit nem találtam, ami megosztásra érdemes... :(');
        } else {
            await user.send('Jó reggelt! Küldöm a legnépszerűbb cikkeket a Forem-ről! Kérlek válaszd ki a cikkekett a "Mehet" gombbal, amiket szeretnéd, hogy kitegyek a "#cikkek" csatornára! Ha valamit mégsem szeretnél megosztani, a "Mégse" gombbal visszavonhatod a választásodat. Ha kész vagy, nyomj a lista alján a "Kész" gombra!');
            for (let i = 0; i < tenForemArticles!.length; i++) {
                const button = createAcceptButtonForNewsAndArticles(tenForemArticles[i].id, 'article');
                // eslint-disable-next-line no-await-in-loop
                await user.send({ content: `Cím: ${tenForemArticles![i].title}\nURL: ${tenForemArticles![i].url}\nLeírás: ${tenForemArticles![i].description}\nCímkék: ${tenForemArticles![i].tags}\nOlvasási idő: ${tenForemArticles![i].reading_time_minutes} perc\nPozitív reakciók: ${tenForemArticles![i].positive_reactions_count}\nPublikálva: ${tenForemArticles![i].readable_publish_date}\nID: ${tenForemArticles![i].id}\n-----------------------------------------------------------------`, components: [button] });
            };
            await user.send({ content: 'Ha kiválasztottad a cikkeket katt ide: ', components: [createDoneButtonForNewsAndArticles('articles')] });
        };
        if (tenHWSWNews.length === 0) {
            await user.send('Sajnos ma semmit nem találtam, ami megosztásra érdemes... :(');
        } else {
            await user.send('És itt van a HWSW aktuális RSS feedje! Kérlek innen is válaszd ki azokat a híreket a "Mehet" gombbal, amiket szeretnéd, hogy kitegyek a "hírek" csatornára! Ha valamit mégsem szeretnél megosztani, a "Mégse" gombbal visszavonhatod a választásodat. Ha kész vagy, nyomj a lista alján a "Kész" gombra!');
            for (let i = 0; i < tenHWSWNews!.length; i++) {
                const date = new Date(`${tenHWSWNews[i].isoDate}`);
                const button = createAcceptButtonForNewsAndArticles(tenHWSWNews[i].id, 'hwswNew');
                // eslint-disable-next-line no-await-in-loop
                await user.send({ content: `Cím: ${tenHWSWNews[i].title}\nTartalom: ${tenHWSWNews[i].content}\nLink: ${tenHWSWNews[i].link}\nDátum: ${date.toLocaleString()}\n-----------------------------------------------------------------`, components: [button] });
            };
            await user.send({ content: 'Ha kiválasztottad a híreket katt ide: ', components: [createDoneButtonForNewsAndArticles('hwswNews')] });
        };
    };
};

export const acceptButtonClickInDM = async (interaction: ButtonInteraction<CacheType>, type: string, id: string) => {
    if (type === 'article' && canChoose.canChooseArticle) {
        const article = await getArticleById(id);
        if (article) {
            choosenArticles.push(article);
            await disableButton(interaction, createCancelButtonForNewsAndArticles(Number(id), 'article'));
        };
    } else if (type === 'article' && !canChoose.canChooseArticle) {
        await interaction.message.edit({ content: `${interaction.message.content}\nMár publikáltam a mai cikkeket. Legközelebb holnap tudsz újra választani!`, components: [] });
    } else if (type === 'hwswNew' && canChoose.canChooseHWSWNew) {
        const choosenNew: HWSWNew | undefined = news.find(n => n.id === Number(id));
        if (choosenNew) {
            choosenNews.push(choosenNew);
            await disableButton(interaction, createCancelButtonForNewsAndArticles(Number(id), 'hwswNew'));
        };
    } else if (type === 'hwswNew' && !canChoose.canChooseHWSWNew) {
        await interaction.message.edit({ content: `${interaction.message.content}\nMár publikáltam a mai híreket. Legközelebb holnap tudsz újra választani!`, components: [] });
    };
};

export const cancelButtonClickInDM = async (interaction: ButtonInteraction<CacheType>, type: string, id: string) => {
    if (type === 'article' && canChoose.canChooseArticle) {
        choosenArticles.splice(choosenArticles.findIndex(article => article.id === Number(interaction.customId.split('_')[1])));
        await interaction.message.edit({
            components: [createAcceptButtonForNewsAndArticles(Number(id), 'article')],
        });
    } else if (type === 'article' && !canChoose.canChooseArticle) {
        await interaction.message.edit({ content: `${interaction.message.content}\nMár publikáltam a mai cikkeket. Legközelebb holnap tudsz újra választani!`, components: [] });
    } else if (type === 'hwswNew' && canChoose.canChooseHWSWNew) {
        choosenNews.splice(choosenNews.findIndex(hwswNew => hwswNew.id === Number(interaction.customId.split('_')[1])));
        await interaction.message.edit({
            components: [createAcceptButtonForNewsAndArticles(Number(id), 'hwswNew')],
        });
    } else if (type === 'hwswNew' && !canChoose.canChooseHWSWNew) {
        await interaction.message.edit({ content: `${interaction.message.content}\nMár publikáltam a mai híreket. Legközelebb holnap tudsz újra választani!`, components: [] });
    };
};

export const doneButtonClickInDM = async (interaction: ButtonInteraction, bot: Client) => {
    if (interaction.customId === 'done_articles' && choosenArticles.length > 0) {
        const channel = await bot.channels.fetch(config.DEVBOT_CIKKEK_CHANNEL) as TextChannel;
        await disableButton(interaction);
        await interaction.message.edit('Már mennek is a csatornára a kiválasztott cikkek! :)');
        await channel.send('@everyone Sziasztok! Itt van néhány cikk a reggeli mellé, amit szeretnék a figyelmetekbe ajánlani! Jó olvasást! :)');
        choosenArticles.forEach(async choosenArticle => {
            await channel.send(`${choosenArticle.url}`);
        });
        choosenArticles.length = 0;
        canChoose.canChooseArticle = false;
    } else if (interaction.customId === 'done_articles' && choosenArticles.length === 0) {
        await interaction.message.edit({ content: 'Még nem választottál ki egyetlen cikket sem!', components: [createDoneButtonForNewsAndArticles('articles')] });
    };

    if (interaction.customId === 'done_hwswNews' && choosenNews.length > 0) {
        const channel = await bot.channels.fetch(config.DEVBOT_HIREK_CHANNEL) as TextChannel;
        await disableButton(interaction);
        await interaction.message.edit('Már mennek is a csatornára a kiválasztott hírek! :)');
        await channel.send('@everyone Sziasztok! Itt van néhány hír a reggeli mellé, amit szeretnék a figyelmetekbe ajánlani! Jó olvasást! :)');
        choosenNews.forEach(async choosenNew => {
            await channel.send(`${choosenNew.link}`);
        });
        choosenNews.length = 0;
        canChoose.canChooseHWSWNew = false;
    } else if (interaction.customId === 'done_hwswNews' && choosenNews.length === 0) {
        await interaction.message.edit({ content: 'Még nem választottál ki egyetlen hírt sem!', components: [createDoneButtonForNewsAndArticles('hwswNews')] });
    };
};

export const sendNewsToAdminDashboard = async (user: User | undefined) => {
    if (!user) {
        logger.error('The user you wanted to send the news and articles is not valid.');
        return;
    }

    await user.send('Jó reggelt! Az oldalon megtalálod a friss, publikálásra alkalmas tartalmakat! :) http://localhost:3000');
};

export const acceptButtonClickInAdminDashboard = async (type: string, id: string): Promise<string | null> => {
    // Done gomb nyomasara uritsuk a kivalasztott tomboket, es toltsuk ujra az oldalt
    if (type === 'article' && canChoose.canChooseArticle) {
        const article = await getArticleById(id);
        if (article) {
            choosenArticles.push(article);
            console.log('Article pushed into the array: ', article.title);
            console.log('Article array length: ', choosenArticles.length);
            return article.title;
        };
    } else if (type === 'hwswNew' && canChoose.canChooseHWSWNew) {
        const choosenNew: HWSWNew | undefined = news.find(n => n.id === Number(id));
        if (choosenNew) {
            choosenNews.push(choosenNew);
            console.log('New pushed into the array: ', choosenNew.title);
            console.log('News array length: ', choosenNews.length);
            return choosenNew.title;
        };
    };
    return null;
};

export const cancelButtonClickInAdminDashboard = async (type: string, id: string): Promise<boolean> => {
    // Done gomb nyomasara uritsuk a kivalasztott tomboket, es toltsuk ujra az oldalt
    if (type === 'article' && canChoose.canChooseArticle) {
        const article = await getArticleById(id);
        if (article) {
            choosenArticles.splice(choosenArticles.findIndex(x => x === article), 1);
            console.log('Article removed from the array: ', article.title);
            console.log('Article array length: ', choosenArticles.length);
            return true;
        };
    } else if (type === 'hwswNew' && canChoose.canChooseHWSWNew) {
        const choosenNew: HWSWNew | undefined = news.find(n => n.id === Number(id));
        if (choosenNew) {
            choosenNews.splice(choosenNews.findIndex(x => x === choosenNew), 1);
            console.log('New removed from the array: ', choosenNew.title);
            console.log('News array length: ', choosenNews.length);
            return true;
        };
    };
    return false;
};