import { REST, Routes } from "discord.js";
import { config } from "../../config.js";
import { commands } from "../commands/utility/index.js";
import { logger } from "../../winston/winston.js";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN_DEV);

export async function deployCommands() {
  try {
    /* eslint no-console: ["error", { allow: ["log", "error"] }] */
    console.log("Started refreshing application (/) commands.");
    logger.info("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(
        config.DISCORD_CLIENT_ID_DEV,
        config.GUILD_ID_DEV,
      ),
      {
        body: commandsData,
      },
    );

    console.log("Successfully reloaded application (/) commands.");
    logger.info("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error updating application (/) commands: ", error);
    logger.error("Error updating application (/) commands: ", error);
  }
}
