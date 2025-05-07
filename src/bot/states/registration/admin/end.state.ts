import { CommandInteraction } from 'discord.js';
import { State } from '../../../interfaces/state.js';
import { Context } from './core/context.js';
import { logger } from '../../../../winston/winston.js';
import { adminHandlerByFunction } from '../../../../logger/handlers/admins.handler.js';

export const END_MSG = 'State vége!';

export class EndState implements State {
    private context: Context;

    name: string;

    private interaction: CommandInteraction;

    constructor (context: Context, interaction: CommandInteraction){
        this.context = context;
        this.interaction = interaction;
        this.name = 'END_STATE';
    }

    async next(): Promise<void | null> {
        this.interaction.user.send('Sikeresen regisztráltál az oldalra! Most már be tudsz jelentkezi a https://svenbot.cloud/login oldalon! :partying_face:');
        this.context.setAdminCreatedAt(new Date().toLocaleString());
        await adminHandlerByFunction(this.context.getAdmin());
        this.context.resetAdmin();
        logger.info(`Registration as admin for svenbot.cloud ended at ${new Date().toLocaleString()} by admin: ${this.interaction.user.globalName}`);
    }
    
}