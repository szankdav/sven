import {
  beforeEach,
  vi,
  describe,
  it,
  expect,
  afterEach,
  MockInstance,
} from 'vitest';
import sqlite3, { Database } from 'sqlite3';
import * as authorModel from '../model/author.model';
import * as messageModel from '../model/message.model';
import { MessagesError } from '../utils/customErrorClasses/messagesError.class';
import * as messagesController from './message.controller';
import { AuthorModel } from '../model/author.model';
import { MessageModel } from '../model/message.model';
import { RenderObject } from '../types/renderObject.type';
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

describe('message.controller tests', () => {
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

  describe('messagesController tests', () => {
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
      const testMessage1: MessageModel = {
        id: 1,
        authorId: 1,
        content: 'Teszt',
        messageCreatedAt: createdAtTime,
      };
      const testMessage2: MessageModel = {
        id: 2,
        authorId: 2,
        content: 'Teszt',
        messageCreatedAt: createdAtTime,
      };
      const testMessage3: MessageModel = {
        id: 3,
        authorId: 1,
        content: 'Teszt',
        messageCreatedAt: createdAtTime,
      };
      const messagesPageNumber = 1;
      const messagesSlicedByTen: MessageModel[] = [
        testMessage1,
        testMessage2,
        testMessage3,
      ];
      const authors: AuthorModel[] = [testAuthor1, testAuthor2];
      const error = '';
      vi.spyOn(messageModel, 'getAllMessages').mockResolvedValue([
        testMessage1,
        testMessage2,
        testMessage3,
      ]);
      vi.spyOn(messageModel, 'getTenMessages').mockResolvedValue([
        testMessage1,
        testMessage2,
        testMessage3,
      ]);
      vi.spyOn(messagesController, 'messagesController');
      vi.spyOn(authorModel, 'getAllAuthors').mockResolvedValue([
        testAuthor1,
        testAuthor2,
      ]);
      const result: RenderObject = await messagesController.messagesController(
        db,
        1,
      );
      expect(result.options).toStrictEqual({
        messagesPageNumber,
        authors,
        messagesSlicedByTen,
        error,
      });
    });

    it('should return with an error renderObject if data is invalid', async () => {
      vi.spyOn(messagesController, 'messagesController');
      const result: RenderObject = await messagesController.messagesController(
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
      const testMessage1: MessageModel = {
        id: 1,
        authorId: 1,
        content: 'Teszt',
        messageCreatedAt: createdAtTime,
      };
      const testMessage2: MessageModel = {
        id: 2,
        authorId: 2,
        content: 'Teszt',
        messageCreatedAt: createdAtTime,
      };
      const testMessage3: MessageModel = {
        id: 3,
        authorId: 1,
        content: 'Teszt',
        messageCreatedAt: createdAtTime,
      };
      vi.spyOn(messageModel, 'getAllMessages').mockResolvedValue([
        testMessage1,
        testMessage2,
        testMessage3,
      ]);
      vi.spyOn(messageModel, 'getTenMessages').mockResolvedValue([
        testMessage1,
        testMessage2,
        testMessage3,
      ]);
      vi.spyOn(messagesController, 'messagesController');
      vi.spyOn(authorModel, 'getAllAuthors').mockResolvedValue([
        testAuthor1,
        testAuthor2,
      ]);
      const messagesPageNumber = 1;
      const messagesSlicedByTen: MessageModel[] = [
        testMessage1,
        testMessage2,
        testMessage3,
      ];
      const authors: AuthorModel[] = [testAuthor1, testAuthor2];
      const error =
        'No messages to show... Are you sure you are at the right URL?';

      const result: RenderObject = await messagesController.messagesController(
        db,
        2,
      );
      expect(result.viewName).toBe('messages');
      expect(result.options).toStrictEqual({
        messagesPageNumber,
        authors,
        messagesSlicedByTen,
        error,
      });
    });

    it('should throw an error with the correct message', async () => {
      vi.spyOn(messagesController, 'messagesController').mockRejectedValue(
        new MessagesError('Error fetching messages!', 500),
      );

      await expect(
        messagesController.messagesController(db, 1),
      ).rejects.toThrow(MessagesError);
      await expect(
        messagesController.messagesController(db, 1),
      ).rejects.toThrow('Error fetching messages!');
    });

    it('should log an error with the correct message', async () => {
      vi.spyOn(messagesController, 'messagesController');
      vi.spyOn(messageModel, 'getTenMessages').mockRejectedValue(
        new Error('Error fetching authors!'),
      );

      await expect(
        messagesController.messagesController(db, 1),
      ).rejects.toThrow('Error fetching messages!');
      expect(loggerError).toHaveBeenCalled();
    });
  });

  describe('messagesByAuthorsController tests', () => {
    it('should return with a valid renderObject if data is valid', async () => {
      const testAuthor1: AuthorModel = {
        id: 1,
        name: 'Teszt Elek',
        createdAt: createdAtTime,
      };
      const testMessage1: MessageModel = {
        id: 1,
        authorId: 1,
        content: 'Teszt',
        messageCreatedAt: createdAtTime,
      };
      const testMessage2: MessageModel = {
        id: 3,
        authorId: 1,
        content: 'Teszt',
        messageCreatedAt: createdAtTime,
      };
      const messages: MessageModel[] = [testMessage1, testMessage2];
      const author: AuthorModel = {
        id: testAuthor1.id,
        name: testAuthor1.name,
        createdAt: testAuthor1.createdAt,
      };
      vi.spyOn(authorModel, 'getAuthorById').mockResolvedValue(testAuthor1);
      vi.spyOn(messageModel, 'getMessagesByAuthorId').mockResolvedValue([
        testMessage1,
        testMessage2,
      ]);
      vi.spyOn(messagesController, 'messagesByAuthorsController');
      const result: RenderObject =
        await messagesController.messagesByAuthorsController(db, [1]);
      expect(result.viewName).toBe('author');
      expect(result.options).toStrictEqual({ author, messages });
    });

    it('should return with a valid renderObject if data is not valid', async () => {
      const messages: MessageModel[] = [];
      const author = { id: 0, name: '-', createdAt: '-' };

      vi.spyOn(authorModel, 'getAuthorById').mockResolvedValue(undefined);
      vi.spyOn(messageModel, 'getMessagesByAuthorId').mockResolvedValue([]);
      vi.spyOn(messagesController, 'messagesByAuthorsController');

      const result: RenderObject =
        await messagesController.messagesByAuthorsController(db, [10]);
      expect(result.viewName).toBe('author');
      expect(result.options).toStrictEqual({ author, messages });
    });

    it('should throw an error with the correct message', async () => {
      vi.spyOn(
        messagesController,
        'messagesByAuthorsController',
      ).mockRejectedValue(new MessagesError('Error fetching messages!', 500));

      await expect(
        messagesController.messagesByAuthorsController(db, [1]),
      ).rejects.toThrow(MessagesError);
      await expect(
        messagesController.messagesByAuthorsController(db, [1]),
      ).rejects.toThrow('Error fetching messages!');
    });

    it('should log an error with the correct message', async () => {
      vi.spyOn(messagesController, 'messagesByAuthorsController');
      vi.spyOn(authorModel, 'getAuthorById').mockRejectedValue(
        new Error('Error fetching author!'),
      );

      await expect(
        messagesController.messagesByAuthorsController(db, [1]),
      ).rejects.toThrow('Error fetching messages!');
      expect(loggerError).toHaveBeenCalled();
    });
  });
});
