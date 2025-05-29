import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from 'vitest';
import sqlite3, { Database } from 'sqlite3';
import { AuthorModel } from '../model/author.model';
import * as authorModel from '../model/author.model';
import * as authorsController from './author.controller';
import { RenderObject } from '../types/renderObject.type';
import { AuthorsError } from '../utils/customErrorClasses/authorsError.class';
import { logger } from '../../winston/winston';

let db: Database;
const createdAtTime = new Date().toLocaleString();
let loggerInfo: MockInstance;
let loggerError: MockInstance;

vi.mock('sqlite3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('sqlite3')>();

  return {
    ...actual,
    Database: vi.fn().mockImplementation(() => ({
      all: vi.fn(),
      get: vi.fn(),
      run: vi.fn(),
      close: vi.fn(),
    })),
  };
});

describe('author.controller tests', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    loggerInfo = vi.spyOn(logger, 'info');
    loggerInfo.mockResolvedValue('Test call');
    loggerError = vi.spyOn(logger, 'error');
    loggerError.mockResolvedValue('Test call');
    db = new sqlite3.Database(':memory:');
  });

  afterEach(() => {
    db.close();
    vi.restoreAllMocks();
  });

  describe('authorsController tests', () => {
    it('should return with a valid renderObject if data is valid', async () => {
      const testAuthor1: AuthorModel = {
        id: 1,
        name: 'Teszt Elek',
        createdAt: createdAtTime,
      };
      const testAuthor2: AuthorModel = {
        id: 2,
        name: 'Teszt Elekné',
        createdAt: createdAtTime,
      };
      const authorsPageNumber = 1;
      const authorsSlicedByTen: AuthorModel[] = [testAuthor1, testAuthor2];
      const error = '';
      vi.spyOn(authorModel, 'getAllAuthors').mockResolvedValue([
        testAuthor1,
        testAuthor2,
      ]);
      vi.spyOn(authorModel, 'getTenAuthors').mockResolvedValue([
        testAuthor1,
        testAuthor2,
      ]);
      vi.spyOn(authorsController, 'authorsController');
      const result: RenderObject = await authorsController.authorsController(
        db,
        1,
      );
      expect(result.viewName).toBe('authors');
      expect(result.options).toStrictEqual({
        authorsPageNumber,
        authorsSlicedByTen,
        error,
      });
    });

    it('should return with an error renderObject if data is invalid', async () => {
      vi.spyOn(authorsController, 'authorsController');
      const result: RenderObject = await authorsController.authorsController(
        db,
        NaN,
      );
      expect(result.viewName).toBe('error');
      expect(result.options).toStrictEqual({ routeError: 'Page not found!', missingTokenError: '', expiredTokenError: '' });
    });

    it('should return with a valid renderObject if data is not valid', async () => {
      const testAuthor1: AuthorModel = {
        id: 1,
        name: 'Teszt Elek',
        createdAt: createdAtTime,
      };
      const testAuthor2: AuthorModel = {
        id: 2,
        name: 'Teszt Elekné',
        createdAt: createdAtTime,
      };
      vi.spyOn(authorModel, 'getAllAuthors').mockResolvedValue([
        testAuthor1,
        testAuthor2,
      ]);
      vi.spyOn(authorModel, 'getTenAuthors').mockResolvedValue([
        testAuthor1,
        testAuthor2,
      ]);
      const authorsPageNumber = 1;
      const authorsSlicedByTen: AuthorModel[] = [testAuthor1, testAuthor2];
      const error =
        'No authors to show... Are you sure you are at the right URL?';
      const result: RenderObject = await authorsController.authorsController(
        db,
        2,
      );
      expect(result.options).toStrictEqual({
        authorsPageNumber,
        authorsSlicedByTen,
        error,
      });
    });

    it('should throw an error with the correct message', async () => {
      vi.spyOn(authorsController, 'authorsController').mockRejectedValue(
        new AuthorsError('Error fetching authors!', 500),
      );

      await expect(authorsController.authorsController(db, 1)).rejects.toThrow(
        AuthorsError,
      );
      await expect(authorsController.authorsController(db, 1)).rejects.toThrow(
        'Error fetching authors!',
      );
    });

    it('should log an error with the correct message', async () => {
      vi.spyOn(authorsController, 'authorsController');
      vi.spyOn(authorModel, 'getTenAuthors').mockRejectedValue(
        new Error('Error fetching authors!'),
      );

      await expect(authorsController.authorsController(db, 1)).rejects.toThrow(
        'Error fetching authors!',
      );
      expect(loggerError).toHaveBeenCalled();
    });
  });

  describe('authorController tests', () => {
    it('should return with an empty AuthorModel array if incoming authorName is empty', async () => {
      const testAuthor1: AuthorModel = {
        id: 1,
        name: 'Teszt Elek',
        createdAt: createdAtTime,
      };
      const testAuthor2: AuthorModel = {
        id: 2,
        name: 'Teszt Elekné',
        createdAt: createdAtTime,
      };
      vi.spyOn(authorModel, 'getAllAuthors').mockResolvedValue([
        testAuthor1,
        testAuthor2,
      ]);
      vi.spyOn(authorsController, 'authorController');
      const result: AuthorModel[] = await authorsController.authorController(
        db,
        '',
      );
      expect(result).toStrictEqual([]);
    });

    it('should return with an AuthorModel array if incoming authorName is found', async () => {
      const testAuthor1: AuthorModel = {
        id: 1,
        name: 'Teszt Elek',
        createdAt: createdAtTime,
      };
      const testAuthor2: AuthorModel = {
        id: 2,
        name: 'Teszt Elekné',
        createdAt: createdAtTime,
      };
      vi.spyOn(authorModel, 'getAllAuthors').mockResolvedValue([
        testAuthor1,
        testAuthor2,
      ]);
      vi.spyOn(authorsController, 'authorController');
      const result: AuthorModel[] = await authorsController.authorController(
        db,
        'Teszt',
      );
      expect(result).toStrictEqual([testAuthor1, testAuthor2]);
    });


    it('should return with a valid renderObject if data is not valid', async () => {
      const testAuthor1: AuthorModel = {
        id: 1,
        name: 'Teszt Elek',
        createdAt: createdAtTime,
      };
      const testAuthor2: AuthorModel = {
        id: 2,
        name: 'Teszt Elekné',
        createdAt: createdAtTime,
      };
      vi.spyOn(authorModel, 'getAllAuthors').mockResolvedValue([
        testAuthor1,
        testAuthor2,
      ]);
      vi.spyOn(authorModel, 'getTenAuthors').mockResolvedValue([
        testAuthor1,
        testAuthor2,
      ]);
      const authorsPageNumber = 1;
      const authorsSlicedByTen: AuthorModel[] = [testAuthor1, testAuthor2];
      const error =
        'No authors to show... Are you sure you are at the right URL?';
      const result: RenderObject = await authorsController.authorsController(
        db,
        2,
      );
      expect(result.options).toStrictEqual({
        authorsPageNumber,
        authorsSlicedByTen,
        error,
      });
    });

    it('should throw an error with the correct message', async () => {
      vi.spyOn(authorsController, 'authorsController').mockRejectedValue(
        new AuthorsError('Error fetching authors!', 500),
      );

      await expect(authorsController.authorsController(db, 1)).rejects.toThrow(
        AuthorsError,
      );
      await expect(authorsController.authorsController(db, 1)).rejects.toThrow(
        'Error fetching authors!',
      );
    });

    it('should log an error with the correct message', async () => {
      vi.spyOn(authorsController, 'authorsController');
      vi.spyOn(authorModel, 'getTenAuthors').mockRejectedValue(
        new Error('Error fetching authors!'),
      );

      await expect(authorsController.authorsController(db, 1)).rejects.toThrow(
        'Error fetching authors!',
      );
      expect(loggerError).toHaveBeenCalled();
    });
  });
});
