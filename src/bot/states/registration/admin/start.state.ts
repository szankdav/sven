import { CommandInteraction } from 'discord.js';
import { State } from '../../../interfaces/state.js';
import { Context } from './core/context.js';
import { UsernameState } from './username.state.js';

export const START_MSG = 'Szia! Segítek, hogy létrehozz egy admin fiókot a svenbot.cloud oldal használatához!';
export const USERNAME_MSG = 'Kérlek add meg a felhasználónevet, amivel regisztrálni szeretnél!';

export class StartState implements State {
    private context: Context;
    
    name: string;

    private interaction: CommandInteraction;

    constructor (context: Context, interaction: CommandInteraction){
        this.context = context;
        this.interaction = interaction;
        this.name = 'START_STATE';
    }

    async next(): Promise<void | null> {
        await this.interaction.user.send(START_MSG);
        await this.interaction.user.send(USERNAME_MSG);
        this.context.setState(new UsernameState(this.context, this.interaction));
    }
}