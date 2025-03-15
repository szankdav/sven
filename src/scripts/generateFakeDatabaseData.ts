import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fakerPath = join(__dirname, "../logger/database/faker/dataFaker.js");

const { runFaker } = await import(`file://${fakerPath}`);

await runFaker();
