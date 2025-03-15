import { fakerHU } from '@faker-js/faker';
import { Database } from 'sqlite3';
import { execute, fetchAll } from "../database.operations.js";
import { db } from "../database.js";
import { logger } from '../../../winston/winston.js';

const createFakeAuthors = (): string[] => {
    const fakeAuthors: string[] = [];
    for (let i = 0; i < 100; i++) {
        const name = fakerHU.person.fullName();
        const discordId = fakerHU.number.int();
        const createdAt = fakerHU.date.past().toISOString();
        fakeAuthors.push(`('${name}', '${discordId}', '${createdAt}')`);
    }
    return fakeAuthors;
};

const insertAuthors = async (db: Database, fakeAuthors: string[]): Promise<void> => {
    await execute(db, `INSERT INTO Authors (name, discordId, createdAt) VALUES ${fakeAuthors.join(", ")}`);
};

const fetchAuthors = async (db: Database): Promise<{ id: number; createdAt: string }[]> => {
    return await fetchAll(db, `SELECT id, createdAt FROM Authors`);
};

const insertLetters = async (db: Database, authors: { id: number; createdAt: string }[]): Promise<void> => {
    const alphabet: string[] = ["a", "á", "b", "c", "d", "e", "é", "f", "g", "h", "i", "í", "j", "k", "l", "m", "n", "o", "ó", "ö", "ő", "p", "q", "r", "s", "t", "u", "ú", "ü", "ű", "v", "w", "x", "y", "z"];
    
    const lettersData: string[] = [];
    authors.forEach(({ id, createdAt }) => {
        alphabet.forEach((letter) => {
            lettersData.push(`(${id}, '${letter}', '${createdAt}', '${createdAt}', 0)`);
        });
    });
    if (lettersData.length) {
        await execute(db, `INSERT INTO Letters (authorId, letter, createdAt, updatedAt, count) VALUES ${lettersData.join(", ")}`);
    }
};

const insertMessages = async (db: Database, authors: { id: number; createdAt: string }[], letterCountMap: Map<string, number>): Promise<void> => {
    const fakeMessages: string[] = [];
    
    for (const author of authors) {
        const randomMessageNumber = Math.floor(Math.random() * (20 - 1 + 1) + 1);

        for (let i = 0; i < randomMessageNumber; i++) {
            const content = fakerHU.string.fromCharacters('aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz', { min: 4, max: 100 });
            const messageCreatedAt = fakerHU.date.past().toISOString();
            fakeMessages.push(`(${author.id}, '${content}', '${messageCreatedAt}')`);

            for (const letter of content) {
                const key = `${author.id}-${letter}`;
                letterCountMap.set(key, (letterCountMap.get(key) || 0) + 1);
            }
        }
    }

    if (fakeMessages.length) {
        await execute(db, `INSERT INTO Messages (authorId, message, createdAt) VALUES ${fakeMessages.join(", ")}`);
    }
};

const updateLetterCounters = async (db: Database, letterCountMap: Map<string, number>): Promise<void> => {
    const updateLetterCounters: string[] = [];
    letterCountMap.forEach((count, key) => {
        const [authorId, letter] = key.split("-");
        updateLetterCounters.push(`UPDATE Letters SET count = count + ${count} WHERE authorId = ${authorId} AND letter = '${letter}';`);
    });

    if (updateLetterCounters.length) {
        await execute(db, updateLetterCounters.join(" "));
    }
};

const fillDatabaseWithFakeData = async (db: Database): Promise<void> => {
    try {
        const fakeAuthors = createFakeAuthors();
        await insertAuthors(db, fakeAuthors);

        const authors = await fetchAuthors(db);
        await insertLetters(db, authors);

        const letterCountMap = new Map<string, number>();
        await insertMessages(db, authors, letterCountMap);
        await updateLetterCounters(db, letterCountMap);
    } catch (error) {
        logger.error(error);
    }
};

export const runFaker = async () => {
    await fillDatabaseWithFakeData(db);
    logger.info("Database filled with fake data.");
} 