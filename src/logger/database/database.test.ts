import { beforeEach, describe, expect, it, vi } from 'vitest';
import sqlite3, { Database } from 'sqlite3';
import { logger } from '../../winston/winston';
import { createTables } from './tables';
import { messageLoggerController } from '../controller/messageLogger.controller';
import { DatabaseError } from '../utils/customErrorClasses/databaseError.class';

let db: Database;

beforeEach(async () => {
    const MAX_MB = 0.03;

    db = new sqlite3.Database(':memory:', (dbErr) => {
        if (dbErr) {
            logger.error('Failed to connect to database:', dbErr);
            return;
        }

        logger.info('Connected to SQLite database successfully!');
        /* eslint-disable @typescript-eslint/no-explicit-any */
        db.get('PRAGMA page_size;', (getErr, getRow: any) => {
            if (getErr) {
                logger.error('Failed to get page size:', getErr);
                return;
            }

            const pageSize = getRow.page_size || 4096;
            const maxPages = Math.max(1, Math.floor((MAX_MB * 1024 * 1024) / pageSize));

            db.run(`PRAGMA max_page_count = ${maxPages};`, (runErr) => {
                if (runErr) {
                    logger.error('Failed to set max_page_count:', runErr);
                    return;
                }

                db.get('PRAGMA max_page_count;', (err, row: any) => {
                    if (err) {
                        logger.error('Failed to read back max_page_count:', err);
                    } else {
                        logger.info(`✅ Database size limited to ~${(row.max_page_count * pageSize) / 1024} KB.`);
                    }
                });
            });
        });
    });

    await createTables(db);

});

describe('database tests', () => {
    it('should log an error when database is full', async () => {
        const discordMessage = {
            discordId: '1',
            username: 'Teszt',
            messageCreatedAt: 1744881904,
            content: 'A'.repeat(20400)
        };
        vi.spyOn(logger, 'crit');

        await messageLoggerController(db, discordMessage);
        const databaseError = new DatabaseError('Error creating message in database: Error: SQLITE_FULL: database or disk is full', 500);
        expect(logger.crit).toHaveBeenCalledWith('Database error: ', databaseError);
    });
});