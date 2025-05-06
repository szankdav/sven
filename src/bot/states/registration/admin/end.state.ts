import { CommandInteraction } from 'discord.js';
import { State } from '../../../interfaces/state.js';
import { Context } from './core/context.js';

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
        // eslint-disable-next-line no-console
        console.log('END');
    }
    
}