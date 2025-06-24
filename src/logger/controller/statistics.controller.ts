import { Database } from 'sqlite3';
import { SqlParams } from '../types/sqlparams.type.js';
import { LetterStatistic } from '../types/letterStatistic.type.js';
import { StatisticError } from '../utils/customErrorClasses/statisticError.class.js';
import {
  AuthorModel,
  getAllAuthors,
  getAuthorById,
} from '../model/author.model.js';
import {
  getLetterCountersByAuthorId,
  LetterModel,
} from '../model/letterCounter.model.js';
import { RenderObject } from '../types/renderObject.type.js';
import { logger } from '../../winston/winston.js';

export const getLetterStatictics = async (
  db: Database,
  params: SqlParams,
): Promise<LetterStatistic[]> => {
  try {
    let sumOfLetterCount = 0;
    const letterCountersByAuthorId: LetterModel[] = await getLetterCountersByAuthorId(
      db,
      params,
    );

    letterCountersByAuthorId.forEach((x) => {
      sumOfLetterCount += x.count;
    });

    const letterStatistics: LetterStatistic[] = letterCountersByAuthorId.map((letterCounter) => {
      const letterStatistic: LetterStatistic = {
        [letterCounter.letter]: Math.round((letterCounter.count / sumOfLetterCount) * 100),
      };
      return letterStatistic;
    });

    return letterStatistics;
  } catch (error) {
    logger.error('Error calculating letter statistics:', error);
    throw new StatisticError('Error calculating letter statistics:', 500);
  }
};

export const statisticsByAuthorController = async (
  db: Database,
  params: SqlParams,
): Promise<RenderObject | null> => {
  try {
    const authorId = Number(params[0]);
    if (!Number.isInteger(authorId) || authorId <= 0) {
      return null;
    };

    const author: AuthorModel | undefined = await getAuthorById(db, params);
    const authors: AuthorModel[] = await getAllAuthors(db);
    const letterCounters: LetterModel[] = await getLetterCountersByAuthorId(
      db,
      params,
    );
    const letterStatistics: LetterStatistic[] = await getLetterStatictics(
      db,
      params,
    );

    if (!author) {
      const renderObject: RenderObject = {
        viewName: 'statistics',
        options: {
          authorFound: false,
          author: null,
          authors: null,
          letterCounters: null,
          letterStatistics: null,
          isLoggedIn: true,
          title: 'Discord Server Monitoring',
          layout: 'layout',
          styles: ['/css/index.css'],
          scripts: ['/js/statistics.js', '/js/searchbar.js', '/js/navbar.js'],
        },
      };
      return renderObject;
    }

    const renderObject: RenderObject = {
      viewName: 'statistics',
      options: {
        authorFound: true,
        author,
        authors,
        letterCounters,
        letterStatistics,
        isLoggedIn: true,
        title: 'Discord Server Monitoring',
        layout: 'layout',
        styles: ['/css/index.css'],
        scripts: ['/js/statistics.js', '/js/searchbar.js', '/js/navbar.js']
      },
    };

    return renderObject;
  } catch (error) {
    logger.error('Error creating letter statistics renderObject:', error);
    throw new StatisticError(
      'Error creating letter statistics renderObject:',
      500,
    );
  }
};
