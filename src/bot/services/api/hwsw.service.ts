import Parser from 'rss-parser';
import { logger } from '../../../winston/winston.js';
import { HWSWNew } from '../../types/hwswNew.type';

const parser = new Parser();
export const news: HWSWNew[] = [];

export const getHWSWNews = async (): Promise<HWSWNew[] | null> => {
  try {
    const feed = await parser.parseURL('http://hwsw.hu/xml/latest_news_rss.xml');
    feed.items.forEach(item => {
      news.push(item as HWSWNew);
    });

    return news;
  } catch (error) {
    logger.error('Error parsing rss feed: ', error);
    return null;
  }
};

