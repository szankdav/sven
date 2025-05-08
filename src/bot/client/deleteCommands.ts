import { Client } from 'discord.js';
import { logger } from '../../winston/winston.js';

// Assume your client is logged in
export async function deleteCommand(client: Client, commandName: string) {
  const commands = await client.application!.commands.fetch(); // fetch global commands
  const command = commands.find(cmd => cmd.name === commandName);

  if (!command) {
    logger.info(`Command ${commandName} not found.`);
    return;
  }

  await client.application!.commands.delete(command.id);
  logger.info(`Deleted command ${commandName}`);
}