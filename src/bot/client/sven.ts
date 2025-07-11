import { CacheType, ChannelType, Client, Collection, Interaction, Message, OAuth2Guild, OmitPartialGroupDMChannel } from 'discord.js';
import { config } from '../../config.js';
import { deployCommandsForSven } from './deploy-commands.js';
import { cooldownForInteraction } from '../interactions/cooldown.interaction.js';
import {
  createMessage,
  answerBotMention,
} from '../events/messageCreate.event.js';
import { logger } from '../../winston/winston.js';
import { handleInput } from '../chat/commandHandler.js';
import { talkWithFaendal, sendArticlesToTheChannel, sendNewsToTheChannel, createNewDiscordEvent, scheduleDailyArticleMessage } from '../services/sven.service.js';
import canChoose from './shared/canChoose.js';

export const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'GuildScheduledEvents', 'DirectMessages', 'MessageContent', 'GuildMembers', 'GuildPresences', 'DirectMessageReactions'],
  partials: [1],
});

client.once('ready', async () => {
  try {
    await deployCommandsForSven();
    await scheduleDailyArticleMessage(client);
    /* eslint no-console: ["error", { allow: ["log"] }] */
    console.log('Sven is ready! 🤖');
    logger.info('Sven is ready! 🤖');
  } catch (error) {
    logger.error('Error updating application (/) commands: ', error);
  }
});

// client.on('messageReactionAdd', async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
//   if (reactionSwitch.articleReaction) {
//     await sendArticlesToTheChannel(reaction, user, client);
//   };

//   if (reactionSwitch.newsReaction) {
//     await sendNewsToTheChannel(reaction, user, client);
//   };

//   if (reaction.message.content?.includes('Új eseményt szeretne létrehozni')) {
//     await judgeNewDiscordEvent(reaction, user, client);
//   };

// });

client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
  try {
    await cooldownForInteraction(interaction);
    if (interaction.isButton()) {
      await interaction.deferUpdate();
      const id = interaction.customId.split('_')[1];
      const type = interaction.customId.split('_')[2];
      if (canChoose.canChooseArticle && (type === 'article' || interaction.customId === 'done_articles')) {
        await sendArticlesToTheChannel(interaction, id, client);
      } else if (canChoose.canChooseArticle === false) {
        await interaction.message.edit({ content: 'Már publikáltam a mai cikkeket. Legközelebb holnap tudsz újra választani!', components: [] });
      } else if (canChoose.canChooseHWSWNew && (type === 'hwswNew' || interaction.customId === 'done_hwswNews')) {
        await sendNewsToTheChannel(interaction, id, client);
      } else if (canChoose.canChooseHWSWNew === false) {
        await interaction.message.edit({ content: 'Már publikáltam a mai híreket. Legközelebb holnap tudsz újra választani!', components: [] });
      };
    };
    await createNewDiscordEvent(interaction, client);
  } catch (error) {
    logger.error('Error during set of interactions cooldown: ', error);
  }
});

client.on('messageCreate', async (message: OmitPartialGroupDMChannel<Message<boolean>>) => {
  try {
    // if (message.author.bot) return;
    if (message.flags.has('Ephemeral')) return;

    if (message.channel.type === ChannelType.DM && !message.author.bot) {
      message.channel.send(handleInput(message.content).execute());
    };

    if (message.channel.type !== ChannelType.DM) {
      await createMessage(message);
    };

    await answerBotMention(message);

    await talkWithFaendal(message);

  } catch (error) {
    logger.error('Error while receiving message from discord: ', error);
  }
});

export function startSven() {
  client.login(config.DISCORD_TOKEN_SVEN_DEV);
}

export const svenServers = async (): Promise<Collection<string, OAuth2Guild>> => client.guilds.fetch();