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
import { LetterCounterError } from '../utils/customErrorClasses/letterCounterError.class.js';
import { logger } from '../../winston/winston.js';
import { DiscordMessage } from '../types/discordMessage.type.js';
import { AuthorsError } from '../utils/customErrorClasses/authorsError.class.js';
import { MessagesError } from '../utils/customErrorClasses/messagesError.class.js';

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
    logger.error('Error creating author in database:', error);
    throw new AuthorsError('Error creating author in database:', 500);
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
    logger.info('Message added to the database!', {
      authorId: message.authorId,
      message: message.content,
    });
  } catch (error) {
    logger.error('Error creating message in database:', error);
    throw new MessagesError('Error creating message in database:', 500);
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

  // for (const letter of validLetters) {
  //   const updatedAt = new Date();
  //   await updateLetterCounter(db, [
  //     updatedAt.toLocaleString(),
  //     messageParams.authorId,
  //     letter,
  //   ]);
  // }
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
    logger.error('Error creating letters:', error);
    throw new LetterCounterError('Error creating letters', 500);
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
    logger.error('Error logging message:', error);
    throw new DatabaseError('Error logging message', 500);
  }
};
