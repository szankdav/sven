import { dirname, join } from "path";

const __dirname = dirname(new URL(import.meta.url).pathname);
const authorModelPath = join(__dirname, "../logger/model/author.model.js");
const dbFilePath = join(__dirname, "../logger/database/database.js");

const { deleteAllAuthors } = await import(`file://${authorModelPath}`);
const { db } = await import(`file://${dbFilePath}`);

await deleteAllAuthors(db);
