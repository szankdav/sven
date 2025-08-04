import Parser from 'rss-parser';
import { logger } from '../../../winston/winston.js';
import { HWSWNew } from '../../types/hwswNew.type';

const parser = new Parser();
export const news: HWSWNew[] = [];

export const getHWSWNews = async (): Promise<HWSWNew[] | null> => {
  try {
    const feed = await parser.parseURL('http://hwsw.hu/xml/latest_news_rss.xml');
    let id = 1;
    for (let i = 0; i < 10; i++) {
      const hwswNew: HWSWNew = {
        id,
        creator: feed.items[i].creator!,
        title: feed.items[i].title!,
        link: feed.items[i].link!,
        pubDate: feed.items[i].pubDate!,
        content: feed.items[i].content!,
        contentSnippet: feed.items[i].contentSnippet!,
        guid: feed.items[i].guid!,
        isoDate: feed.items[i].isoDate!
      };
      id += 1;
      news.push(hwswNew);
    };
    return news;
  } catch (error) {
    logger.error('Error parsing rss feed: ', error);
    return null;
  }
};

