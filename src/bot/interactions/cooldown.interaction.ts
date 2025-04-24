import { CacheType, Collection, Interaction, InteractionResponse, MessageFlags } from 'discord.js';
import { svenCommands } from '../commands/utility/index.js';
import { logger } from '../../winston/winston.js';

const cooldowns = new Collection<string, Collection<string, number>>();

export async function cooldownForInteraction(interaction: Interaction<CacheType>): Promise<InteractionResponse<boolean> | void> {
  try {
    logger.info(`Incoming interaction: ${interaction.type}`);
    if (!interaction.isCommand()) {
      logger.info('Incoming interaction was not a command. No cooldown added.');
      return Promise.resolve();
    }
    const { commandName } = interaction;

    const command: string = interaction.commandName;

    if (!cooldowns.has(command)) {
      cooldowns.set(command, new Collection<string, number>());
      logger.info(`Command: ${command} added to cooldowns.`);
    }

    const now = Date.now();
    const timestamps: Collection<string, number> = cooldowns.get(command)!;
    const defaultCooldownDuration = 5;
    const cooldownAmount = defaultCooldownDuration * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime =
        Math.round(timestamps.get(interaction.user.id)! / 1000) +
        cooldownAmount / 1000;

      if (now < expirationTime * 1000) {
        const remainingTime = Math.round(expirationTime - now / 1000);
        logger.info(
          `Interaction: ${interaction.commandName} was tried to get use within the expiration time by user: ${interaction.user.globalName}`,
        );
        return interaction.reply({
          content: `Kérlek várj még ${remainingTime} másodpercet, mielőtt újra használnád a \`${command}\` parancsot.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`);
      return Promise.resolve();
    }

    if (svenCommands[commandName as keyof typeof svenCommands]) {
      return svenCommands[commandName as keyof typeof svenCommands].execute(interaction);
    }

    return Promise.resolve();
  } catch (error) {
    throw new Error(`${error}`);
  }
}
