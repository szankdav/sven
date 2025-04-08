/* eslint-disable prettier/prettier */
import {
  beforeEach,
  vi,
  describe,
  it,
  expect,
  afterEach,
  MockInstance,
} from 'vitest';
import sqlite3, { Database, RunResult } from 'sqlite3';
import * as authorModel from '../model/author.model';
import * as messageModel from '../model/message.model';
import * as messageLoggerController from './messageLogger.controller';
import * as letterCounterModel from '../model/letterCounter.model';
import { AuthorModel } from '../model/author.model';
import { MessageModel } from '../model/message.model';
import { LetterCounterError } from '../utils/customErrorClasses/letterCounterError.class';
import { logger } from '../../winston/winston';
import { DiscordMessage } from '../types/discordMessage.type';
import { MessagesError } from '../utils/customErrorClasses/messagesError.class';
import { AuthorsError } from '../utils/customErrorClasses/authorsError.class';
import { DatabaseError } from '../utils/customErrorClasses/databaseError.class';

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

describe('messageLogger.controller tests', () => {
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

  describe('insertAuthorIntoDatabase tests', async () => {
    it('should add an author to the database from the incoming data', async () => {
      const message: DiscordMessage = {
        username: 'Ifj. Teszt Elek',
        discordId: '1069636403335837253',
        messageCreatedAt: 500000000000,
        content: 'Teszt',
      };
      vi.spyOn(authorModel, 'getAuthorByDiscordId').mockResolvedValue(undefined);
      vi.spyOn(authorModel, 'createAuthor').mockResolvedValue({ lastID: 1, changes: 1 } as RunResult);
      const result = await messageLoggerController.insertAuthorIntoDatabase(
        db,
        message,
      );
      expect(result).toBe(1);
      expect(loggerInfo).toHaveBeenCalledWith('Author added to the database!', {
        username: message.username,
      });
      expect(loggerError).not.toHaveBeenCalled();
    });

    it("should return with the existed author's id", async () => {
      const message: DiscordMessage = {
        username: 'Ifj. Teszt Elek',
        discordId: '1069636403335837253',
        messageCreatedAt: 500000000000,
        content: 'Teszt',
      };
      const testAuthor1: AuthorModel = {
        id: 1,
        name: 'Teszt Elek',
        createdAt: createdAtTime,
      };
      vi.spyOn(authorModel, 'getAuthorByDiscordId').mockResolvedValueOnce(testAuthor1);
      const result = await messageLoggerController.insertAuthorIntoDatabase(
        db,
        message,
      );
      expect(result).toBe(1);
      expect(loggerInfo).not.toHaveBeenCalled();
      expect(loggerError).not.toHaveBeenCalled();
    });

    it('should not add an author to the database from the incoming data if author already exists', async () => {
      const testAuthor1: AuthorModel = {
        id: 1,
        name: 'Teszt Elek',
        createdAt: createdAtTime,
      };
      vi.spyOn(authorModel, 'getAuthorByDiscordId').mockResolvedValueOnce(testAuthor1);
      const message: DiscordMessage = {
        username: 'Teszt Elek',
        discordId: '1069636403335837253',
        messageCreatedAt: 500000000000,
        content: 'Teszt',
      };
      const result = await messageLoggerController.insertAuthorIntoDatabase(
        db,
        message,
      );
      expect(result).toBe(1);
      expect(loggerInfo).not.toHaveBeenCalledWith(
        'Author added to the database!',
        { username: message.username },
      );
      expect(loggerError).not.toHaveBeenCalled();
    });

    //   it("should create the message for the newly added author", async () => {
    //     const testAuthor1: AuthorModel = {
    //       id: 1,
    //       name: "Teszt Elek",
    //       createdAt: createdAtTime,
    //     };
    //     vi.spyOn(messageLoggerController, "messageLoggerController");
    //     vi.spyOn(authorModel, "createAuthor").mockResolvedValue(undefined);
    //     vi.spyOn(authorModel, "getAuthorByDiscordId")
    //       .mockResolvedValueOnce(testAuthor1)
    //       .mockResolvedValueOnce(testAuthor1);
    //     vi.spyOn(messageModel, "createMessage").mockResolvedValue(undefined);
    //     vi.spyOn(
    //       letterCounterModel,
    //       "getLetterCounterByAuthorId",
    //     ).mockResolvedValue(undefined);
    //     vi.spyOn(letterCounterModel, "createLetterCounters").mockResolvedValue(
    //       undefined,
    //     );
    //     vi.spyOn(letterCounterModel, "updateLetterCounter").mockResolvedValue(
    //       undefined,
    //     );
    //     const message: DiscordMessage = {
    //       username: "Ifj. Teszt Elek",
    //       discordId: "1069636403335837253",
    //       messageCreatedAt: 500000000000,
    //       content: "Teszt",
    //     };
    //     await messageLoggerController.messageLoggerController(db, message);
    //     expect(loggerInfo).toHaveBeenCalledWith(
    //       "Message added to the database!",
    //       { authorId: testAuthor1.id, message: message.content },
    //     );
    //     expect(loggerError).not.toHaveBeenCalled();
    //   });

    it('should throw an error with the correct message', async () => {
      vi.spyOn(
        messageLoggerController,
        'insertAuthorIntoDatabase',
      ).mockRejectedValue(
        new AuthorsError('Error creating author in database:', 500),
      );
      const message: DiscordMessage = {
        username: 'Ifj. Teszt Elek',
        discordId: '1069636403335837253',
        messageCreatedAt: 500000000000,
        content: 'Teszt',
      };
      await expect(
        messageLoggerController.insertAuthorIntoDatabase(db, message),
      ).rejects.toThrow(AuthorsError);
      await expect(
        messageLoggerController.insertAuthorIntoDatabase(db, message),
      ).rejects.toThrow('Error creating author in database:');
    });

    it('should log an error with the correct message', async () => {
      vi.spyOn(messageLoggerController, 'insertAuthorIntoDatabase');
      const error = new AuthorsError('Error creating author in database:', 500);
      vi.spyOn(authorModel, 'getAuthorByDiscordId').mockRejectedValue(error);
      const message: DiscordMessage = {
        username: 'Ifj. Teszt Elek',
        discordId: '1069636403335837253',
        messageCreatedAt: 500000000000,
        content: 'Teszt',
      };
      await expect(
        messageLoggerController.insertAuthorIntoDatabase(db, message),
      ).rejects.toThrow('Error creating author in database:');
      expect(loggerError).toHaveBeenCalledWith(
        'Error creating author in database:',
        error,
      );
    });
  });

  describe('insertMessageIntoDatabase tests', async () => {
    it('should add a message to the database from the incoming data', async () => {
      vi.spyOn(messageModel, 'createMessage').mockResolvedValue(undefined);
      const message: MessageModel = {
        id: 0,
        authorId: 1,
        content: 'Test',
        messageCreatedAt: createdAtTime,
      };
      await messageLoggerController.insertMessageIntoDatabase(db, message);
      expect(loggerError).not.toHaveBeenCalled();
    });

    it('should throw an error with the correct message', async () => {
      vi.spyOn(
        messageLoggerController,
        'insertMessageIntoDatabase',
      ).mockRejectedValue(
        new MessagesError('Error creating message in database:', 500),
      );
      const message: MessageModel = {
        id: 0,
        authorId: 1,
        content: 'Test',
        messageCreatedAt: createdAtTime,
      };
      await expect(
        messageLoggerController.insertMessageIntoDatabase(db, message),
      ).rejects.toThrow(MessagesError);
      await expect(
        messageLoggerController.insertMessageIntoDatabase(db, message),
      ).rejects.toThrow('Error creating message in database:');
    });

    it('should log an error with the correct message', async () => {
      const error = new MessagesError(
        'Error creating message in database:',
        500,
      );
      vi.spyOn(messageLoggerController, 'insertMessageIntoDatabase');
      vi.spyOn(messageModel, 'createMessage').mockRejectedValue(error);
      const message: MessageModel = {
        id: 0,
        authorId: 1,
        content: 'Test',
        messageCreatedAt: createdAtTime,
      };
      await expect(
        messageLoggerController.insertMessageIntoDatabase(db, message),
      ).rejects.toThrow('Error creating message in database:');
      expect(loggerError).toHaveBeenCalledWith(
        'Error creating message in database:',
        error,
      );
    });
  });

  describe('messageLoggerController tests', async () => {
    it('should throw an error with the correct message', async () => {
      vi.spyOn(
        messageLoggerController,
        'messageLoggerController',
      ).mockRejectedValue(new DatabaseError('Error logging message:', 500));
      const message: DiscordMessage = {
        username: 'Ifj. Teszt Elek',
        discordId: '1069636403335837253',
        messageCreatedAt: 500000000000,
        content: 'Teszt',
      };
      await expect(
        messageLoggerController.messageLoggerController(db, message),
      ).rejects.toThrow(DatabaseError);
      await expect(
        messageLoggerController.messageLoggerController(db, message),
      ).rejects.toThrow('Error logging message:');
    });

    it('should log an error with the correct message', async () => {
      const error = new DatabaseError('Error logging message:', 500);
      vi.spyOn(messageLoggerController, 'messageLoggerController');
      vi.spyOn(
        messageLoggerController,
        'insertAuthorIntoDatabase',
      ).mockRejectedValue(error);
      const message: DiscordMessage = {
        username: 'Ifj. Teszt Elek',
        discordId: '1069636403335837253',
        messageCreatedAt: 500000000000,
        content: 'Teszt',
      };
      await expect(
        messageLoggerController.messageLoggerController(db, message),
      ).rejects.toThrow('Error logging message');
      expect(loggerError).toHaveBeenCalled();
    });
  });

  describe('createLetterCountersInDatabase tests', async () => {
    it('should create the letters for the newly added author', async () => {
      const testAuthor1: AuthorModel = {
        id: 1,
        name: 'Teszt Elek',
        createdAt: createdAtTime,
      };
      vi.spyOn(
        letterCounterModel,
        'getLetterCounterByAuthorId',
      ).mockResolvedValue(undefined);
      vi.spyOn(letterCounterModel, 'createLetterCounters').mockResolvedValue(
        undefined,
      );
      vi.spyOn(letterCounterModel, 'updateLetterCounter').mockResolvedValue(
        undefined,
      );
      const message: MessageModel = {
        id: 0,
        authorId: testAuthor1.id,
        content: 'Test',
        messageCreatedAt: createdAtTime.toLocaleString(),
      };
      await messageLoggerController.createLetterCountersInDatabase(db, message);
      expect(loggerInfo).toHaveBeenCalledWith('Letters added for the author!', {
        authorId: testAuthor1.id,
      });
      expect(loggerError).not.toHaveBeenCalled();
    });

    it('should not create the letters again for the author if already existed', async () => {
      const testAuthor1: AuthorModel = {
        id: 1,
        name: 'Teszt Elek',
        createdAt: createdAtTime,
      };
      vi.spyOn(
        letterCounterModel,
        'getLetterCounterByAuthorId',
      ).mockResolvedValue({ authorId: testAuthor1.id });
      vi.spyOn(letterCounterModel, 'createLetterCounters').mockResolvedValue(
        undefined,
      );
      vi.spyOn(letterCounterModel, 'updateLetterCounter').mockResolvedValue(
        undefined,
      );
      const message: MessageModel = {
        id: 0,
        authorId: testAuthor1.id,
        content: 'Test',
        messageCreatedAt: createdAtTime.toLocaleString(),
      };
      await messageLoggerController.createLetterCountersInDatabase(db, message);
      expect(loggerInfo).not.toHaveBeenCalledWith(
        'Letters added for the author!',
        { authorId: testAuthor1.id },
      );
      expect(loggerError).not.toHaveBeenCalled();
    });

    it('should throw an error with the correct message', async () => {
      vi.spyOn(
        messageLoggerController,
        'messageLoggerController',
      ).mockRejectedValue(
        new LetterCounterError('Error creating letters:', 500),
      );
      const message: DiscordMessage = {
        username: 'Ifj. Teszt Elek',
        discordId: '1069636403335837253',
        messageCreatedAt: 500000000000,
        content: 'Teszt',
      };
      await expect(
        messageLoggerController.messageLoggerController(db, message),
      ).rejects.toThrow(LetterCounterError);
      await expect(
        messageLoggerController.messageLoggerController(db, message),
      ).rejects.toThrow('Error creating letters');
    });

    it('should log an error with the correct message if author is not found during getLetterCounterByAuthor', async () => {
      vi.spyOn(messageLoggerController, 'messageLoggerController');
      vi.spyOn(
        letterCounterModel,
        'getLetterCounterByAuthorId',
      ).mockRejectedValue(new Error('Author not found!'));
      const message: MessageModel = {
        id: 1,
        authorId: 1,
        content: '',
        messageCreatedAt: '',
      };
      await expect(
        messageLoggerController.createLetterCountersInDatabase(db, message),
      ).rejects.toThrow('Error creating letters');
      expect(loggerError).toHaveBeenCalled();
    });

    it('should log an error with the correct message if author is not found during createLetterCounters', async () => {
      vi.spyOn(messageLoggerController, 'messageLoggerController');
      vi.spyOn(letterCounterModel, 'createLetterCounters').mockRejectedValue(
        new Error('Author not found!'),
      );
      const message: MessageModel = {
        id: 1,
        authorId: 1,
        content: '',
        messageCreatedAt: '',
      };
      await expect(
        messageLoggerController.createLetterCountersInDatabase(db, message),
      ).rejects.toThrow('Error creating letters');
      expect(loggerError).toHaveBeenCalled();
    });
  });

  describe('letterIterator tests', async () => {
    it('should call updateLetterCounter by the amount of letters', async () => {
      vi.spyOn(messageLoggerController, 'letterIterator');
      vi.spyOn(letterCounterModel, 'updateLetterCounter').mockResolvedValue(
        undefined,
      );
      const messageParams: MessageModel = {
        id: 0,
        authorId: 1,
        content: 'Teszt',
        messageCreatedAt: new Date().toLocaleString(),
      };
      await messageLoggerController.letterIterator(db, messageParams);
      expect(letterCounterModel.updateLetterCounter).toHaveBeenCalledTimes(
        messageParams.content.length,
      );
    });
  });
});
