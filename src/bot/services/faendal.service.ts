import { Message, OmitPartialGroupDMChannel } from 'discord.js';
import { hikeConversation } from '../commands/texts/conversations.js';
import { logger } from '../../winston/winston.js';

let index = 0;
export const talkWithSven = async (message: OmitPartialGroupDMChannel<Message<boolean>>) => {
    try {
        // if (message.author.bot) return;
        if (message.author.bot && message.author.displayName === 'SvenDevBot' && message.content.includes('<@1363775791904718920>') && index < hikeConversation.faendal.length) {
          do {
            // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
            await new Promise(r => setTimeout(r, Math.random() * (5000 - 1500 + 1) + 1500));
            message.channel.send(hikeConversation.faendal[index]);
            index++;
          } while (!hikeConversation.faendal[index - 1].includes('<@1352273717623001209>'));
        }
      } catch (error) {
        logger.error('Error while receiving message from discord: ', error);
      }
};