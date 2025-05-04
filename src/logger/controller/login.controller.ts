import { Database } from 'sqlite3';
import { SqlParams } from '../types/sqlparams.type.js';
import { getAuthorByName } from '../model/author.model.js';

export const login = async (db: Database, params: SqlParams): Promise<boolean> => {
    try {
        const validUser = !!await getAuthorByName(db, params);
        return validUser;
    } catch (error) {
        throw new Error(`Error during login: ${error}`);
    }
};