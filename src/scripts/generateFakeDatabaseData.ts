import { join } from "path";

const __dirname = import.meta.dirname;
const fakerPath = join(__dirname, "../logger/database/faker/dataFaker.js");

const { runFaker } = await import(`file://${fakerPath}`);

await runFaker();
