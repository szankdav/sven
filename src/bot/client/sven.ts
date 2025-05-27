import { ChannelType, Client } from 'discord.js';
import { config } from '../../config.js';
import { deployCommandsForSven } from './deploy-commands.js';
import { cooldownForInteraction } from '../interactions/cooldown.interaction.js';
import {
  createMessage,
  answerBotMention,
} from '../events/messageCreate.event.js';
import { logger } from '../../winston/winston.js';
import { hikeConversation } from '../commands/texts/conversations.js';
import { handleInput } from '../chat/commandHandler.js';

export const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages', 'MessageContent', 'GuildMembers', 'GuildPresences'],
  partials: [1],
});

client.once('ready', async () => {
  try {
    await deployCommandsForSven();
    /* eslint no-console: ["error", { allow: ["log"] }] */
    console.log('Sven is ready! 🤖');
    logger.info('Sven is ready! 🤖');
  } catch (error) {
    logger.error('Error updating application (/) commands: ', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    await cooldownForInteraction(interaction);
  } catch (error) {
    logger.error('Error during set of interactions cooldown: ', error);
  }
});

let index = 1;
client.on('messageCreate', async (message) => {
  try {
    // if (message.author.bot) return;
    if (message.flags.has('Ephemeral')) return; // tegyunk minden bot uzenetet Ephemeral-ra, amit nem szeretnenk logolni

    if (message.channel.type === ChannelType.DM && !message.author.bot) {
      message.channel.send(handleInput(message.content).execute());
    };

    if (message.channel.type !== ChannelType.DM) {
      await createMessage(message);
    };

    await answerBotMention(message);

    if (message.author.bot && message.author.displayName === 'FaendalDevBot' && message.content.includes('<@1352273717623001209>') && index < hikeConversation.sven.length) {
      do {
        // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
        await new Promise(r => setTimeout(r, Math.random() * (5000 - 1500 + 1) + 1500));
        message.channel.send(hikeConversation.sven[index]);
        index++;
      } while (!hikeConversation.sven[index - 1].includes('<@1363775791904718920>'));
    }
  } catch (error) {
    logger.error('Error while receiving message from discord: ', error);
  }
});

export function startSven() {
  client.login(config.DISCORD_TOKEN_SVEN_DEV);
}