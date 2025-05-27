import { Database } from 'sqlite3';
import { AuthorsError } from '../utils/customErrorClasses/authorsError.class.js';
import {
  AuthorModel,
  getAllAuthors,
  getTenAuthors,
} from '../model/author.model.js';
import { RenderObject } from '../types/renderObject.type.js';
import { logger } from '../../winston/winston.js';

export const authorsController = async (
  db: Database,
  page: number,
): Promise<RenderObject> => {
  try {
    if (Number.isNaN(page) || page <= 0) {
      const renderObject: RenderObject = {
        viewName: 'error',
        options: { routeError: 'Page not found!', missingTokenError: '', expiredTokenError: '' },
      };
      return renderObject;
    }
    const authorsPageNumber: number = Math.ceil(
      (await getAllAuthors(db)).length / 10,
    );
    const authorsSlicedByTen: AuthorModel[] = await getTenAuthors(db, [
      page === 1 ? 0 : (page - 1) * 10,
    ]);
    let error = '';
    if (page > authorsPageNumber) {
      error = 'No authors to show... Are you sure you are at the right URL?';
    }

    const renderObject: RenderObject = {
      viewName: 'authors',
      options: { authorsPageNumber, authorsSlicedByTen, error },
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
    const matchingAuthors = allAuthors.filter((author) => author.name.toLowerCase().includes(authorName.toLowerCase()));
    return matchingAuthors;
  } catch (error) {
    logger.error('Error fetching matching authors from search:', error);
    throw new AuthorsError('Error fetching matching authors from search!', 500);
  }
};