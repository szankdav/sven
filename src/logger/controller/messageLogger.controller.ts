import { Database, RunResult } from 'sqlite3';
import {
  AuthorModel,
  createAuthor,
  getAuthorByDiscordId,
} from '../model/author.model.js';
import { createMessage, MessageModel } from '../model/message.model.js';
import { DatabaseError } from '../utils/customErrorClasses/databaseError.class.js';
import { SqlParams } from '../types/sqlparams.type.js';
import {
  createLetterCounters,
  getLetterCounterByAuthorId,
  updateLetterCounter,
} from '../model/letterCounter.model.js';
import { logger } from '../../winston/winston.js';
import { DiscordMessage } from '../types/discordMessage.type.js';

export const insertAuthorIntoDatabase = async (
  db: Database,
  message: DiscordMessage,
): Promise<number> => {
  try {
    const messageCreatedAt = new Date(message.messageCreatedAt);
    const authorToCreate: SqlParams = [
      message.username,
      message.discordId,
      messageCreatedAt.toLocaleString(),
    ];

    const authorExistedInDatabase: AuthorModel | undefined =
      await getAuthorByDiscordId(db, [message.discordId]);

    if (authorExistedInDatabase) {
      return authorExistedInDatabase!.id;
    }
    const author: RunResult = await createAuthor(db, authorToCreate);
    logger.info('Author added to the database!', {
      username: message.username,
    });
    return author.lastID;

  } catch (error) {
    throw new DatabaseError(`Error creating author in database: ${error}`, 500);
  }
};

export const insertMessageIntoDatabase = async (
  db: Database,
  message: MessageModel,
) => {
  try {
    await createMessage(db, [
      message.authorId,
      message.content,
      message.messageCreatedAt,
    ]);
  } catch (error) {
    throw new DatabaseError(`Error creating message in database: ${error}`, 500);
  }
};

export const letterIterator = async (
  db: Database,
  messageParams: MessageModel,
): Promise<void> => {
  const validLetters: string[] = messageParams.content
    .toLowerCase()
    .split('')
    .filter((char) => /^[a-záéíóöőúüű]$/i.test(char));

  const promises: Promise<void>[] = validLetters.map((letter) => {
    const updatedAt = new Date();
    return updateLetterCounter(db, [
      updatedAt.toLocaleString(),
      messageParams.authorId,
      letter,
    ]);
  });

  await Promise.all(promises);
};

export const createLetterCountersInDatabase = async (
  db: Database,
  messageParams: MessageModel,
): Promise<void> => {
  try {
    const existingAuthorId = await getLetterCounterByAuthorId(db, [
      messageParams.authorId,
    ]);
    if (!existingAuthorId) {
      await createLetterCounters(db, [
        messageParams.authorId,
        '',
        0,
        messageParams.messageCreatedAt,
        new Date().toLocaleString(),
      ]);
      logger.info('Letters added for the author!', {
        authorId: messageParams.authorId,
      });
    }
    await letterIterator(db, messageParams);
  } catch (error) {
    throw new DatabaseError(`Error creating letters: ${error}`, 500);
  }
};

export const messageLoggerController = async (
  db: Database,
  message: DiscordMessage,
): Promise<void> => {
  try {
    const authorId: number = await insertAuthorIntoDatabase(db, message);
    const messageToCreate: MessageModel = {
      id: 0,
      authorId,
      content: message.content,
      messageCreatedAt: new Date(message.messageCreatedAt).toLocaleString(),
    };
    await insertMessageIntoDatabase(db, messageToCreate);
    await createLetterCountersInDatabase(db, messageToCreate);
  } catch (error) {
    logger.crit('Database error: ', error);
  }
};
