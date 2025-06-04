import { Database } from 'sqlite3';
import {
  getAllMessages,
  getTenMessages,
  getMessagesByAuthorId,
  MessageModel,
} from '../model/message.model.js';
import { SqlParams } from '../types/sqlparams.type.js';
import { MessagesError } from '../utils/customErrorClasses/messagesError.class.js';
import { RenderObject } from '../types/renderObject.type.js';
import {
  AuthorModel,
  getAllAuthors,
  getAuthorById,
} from '../model/author.model.js';
import { logger } from '../../winston/winston.js';

export const messagesController = async (
  db: Database,
  page: SqlParams,
): Promise<RenderObject | null> => {
  try {
    const pageNumber = Number(page[0]);
    if (!Number.isInteger(pageNumber) || pageNumber <= 0) {
      return null;
    }
    const messagesPageNumber: number = Math.ceil(
      (await getAllMessages(db)).length / 10,
    );
    const messagesSlicedByTen: MessageModel[] = await getTenMessages(db, [
      pageNumber === 1 ? 0 : (pageNumber - 1) * 10,
    ]);
    const authors: AuthorModel[] = await getAllAuthors(db);
    let error = '';
    if (pageNumber > messagesPageNumber) {
      error = 'No messages to show... Are you sure you are at the right URL?';
    }

    const renderObject: RenderObject = {
      viewName: 'messages',
      options: { messagesPageNumber, authors, messagesSlicedByTen, error, isLoggedIn: true },
    };

    return renderObject;
  } catch (error) {
    logger.error('Error creating messages renderObject:', error);
    throw new MessagesError('Error fetching messages!', 500);
  }
};

export const messagesByAuthorsController = async (
  db: Database,
  params: SqlParams,
): Promise<RenderObject | null> => {
  try {
    const authorId = Number(params[0]);
    if (!Number.isInteger(authorId) || authorId <= 0) {
      return null;
    };

    const author: AuthorModel | undefined = await getAuthorById(db, [authorId]);
    const messages: MessageModel[] = await getMessagesByAuthorId(db, [authorId]);


    if (!author) {
      const renderObject: RenderObject = {
        viewName: 'author',
        options: { authorFound: false, author, messages, isLoggedIn: true },
      };
      return renderObject;
    }

    const renderObject: RenderObject = {
      viewName: 'author',
      options: { authorFound: true, author, messages, isLoggedIn: true },
    };

    return renderObject;
  } catch (error) {
    logger.error('Error creating messages renderObject:', error);
    throw new MessagesError('Error fetching messages!', 500);
  }
};
