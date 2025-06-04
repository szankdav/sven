import { Database } from 'sqlite3';
import { AuthorsError } from '../utils/customErrorClasses/authorsError.class.js';
import {
  AuthorModel,
  getAllAuthors,
  getTenAuthors,
} from '../model/author.model.js';
import { RenderObject } from '../types/renderObject.type.js';
import { logger } from '../../winston/winston.js';
import { SqlParams } from '../types/sqlparams.type.js';

export const authorsController = async (
  db: Database,
  page: SqlParams,
): Promise<RenderObject | null> => {
  try {
    const pageNumber = Number(page[0]);
    if (!Number.isInteger(pageNumber) || pageNumber <= 0) {
      return null;
    }
    const authorsPageNumber: number = Math.ceil(
      (await getAllAuthors(db)).length / 10,
    );
    const authorsSlicedByTen: AuthorModel[] = await getTenAuthors(db, [
      pageNumber === 1 ? 0 : (pageNumber - 1) * 10,
    ]);
    let error = '';
    if (pageNumber > authorsPageNumber) {
      error = 'No authors to show... Are you sure you are at the right URL?';
    }

    const renderObject: RenderObject = {
      viewName: 'authors',
      options: { authorsPageNumber, authorsSlicedByTen, error, isLoggedIn: true },
    };

    return renderObject;
  } catch (error) {
    logger.error('Error creating authors renderObject:', error);
    throw new AuthorsError('Error fetching authors!', 500);
  }
};

export const authorController = async (db: Database, authorName: string): Promise<AuthorModel[]> => {
  try {
    const allAuthors = await getAllAuthors(db);
    let matchingAuthors: AuthorModel[] = [];
    if (authorName === '') {
      return matchingAuthors;
    }
    matchingAuthors = allAuthors.filter((author) => author.name.toLowerCase().includes(authorName.toLowerCase()));
    return matchingAuthors;
  } catch (error) {
    logger.error('Error fetching matching authors from search:', error);
    throw new AuthorsError('Error fetching matching authors from search!', 500);
  }
};