import { dirname, join } from "path";

const __dirname = dirname(new URL(import.meta.url).pathname);
const fakerPath = join(__dirname, "../logger/database/faker/dataFaker.js");

const { runFaker } = await import(`file://${fakerPath}`);

await runFaker();
