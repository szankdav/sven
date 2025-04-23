import { REST, Routes } from 'discord.js';
import { config } from '../../config.js';
import { svenCommands } from '../commands/utility/index.js';
import { logger } from '../../winston/winston.js';

const svenCommandsData = Object.values(svenCommands).map((command) => command.data);


export async function deployCommandsForSven() {
  const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN_SVEN_DEV);
  try {
    /* eslint no-console: ["error", { allow: ["log", "error"] }] */
    console.log('Started refreshing application (/) commands for Sven.');
    logger.info('Started refreshing application (/) commands for Sven.');

    await rest.put(
      Routes.applicationGuildCommands(
        config.DISCORD_CLIENT_SVEN_ID_DEV,
        config.GUILD_ID_DEV,
      ),
      {
        body: svenCommandsData,
      },
    );

    console.log('Successfully reloaded application (/) commands for Sven.');
    logger.info('Successfully reloaded application (/) commands for Sven.');
  } catch (error) {
    throw new Error(`${error}`);
  }
}
