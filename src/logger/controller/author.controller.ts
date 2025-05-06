import { Database } from 'sqlite3';
import { AuthorsError } from '../utils/customErrorClasses/authorsError.class.js';
import {
  AuthorModel,
  getAllAuthors,
  getAuthorByName,
  getTenAuthors,
} from '../model/author.model.js';
import { RenderObject } from '../types/renderObject.type.js';
import { logger } from '../../winston/winston.js';
import { SqlParams } from '../types/sqlparams.type.js';

export const authorsController = async (
  db: Database,
  page: number,
): Promise<RenderObject> => {
  try {
    if (Number.isNaN(page) || page <= 0) {
      const renderObject: RenderObject = {
        viewName: 'error',
        options: { err: 'Page not found!' },
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

export const authorController = async (db: Database, authorName: SqlParams): Promise<number> => {
  try {
    const result = await getAuthorByName(db, authorName);
    if (result) {
      const allAuthors = await getAllAuthors(db);
      const authorIndex = allAuthors.findIndex((author) => author.name === result.name);
      const authorPageNumber: number = Math.ceil((authorIndex + 1) / 10);
      return authorPageNumber;
    }
    return 0;
  } catch (error) {
    logger.error('Error fetching author:', error);
    throw new AuthorsError('Error fetching author!', 500);
  }
};
