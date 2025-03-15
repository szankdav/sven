import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const authorModelPath = join(__dirname, "../logger/model/author.model.js");
const dbFilePath = join(__dirname, "../logger/database/database.js");

const { deleteAllAuthors } = await import(`file://${authorModelPath}`);
const { db } = await import(`file://${dbFilePath}`);

await deleteAllAuthors(db);
