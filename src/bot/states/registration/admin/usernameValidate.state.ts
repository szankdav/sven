import { CommandInteraction } from 'discord.js';
import { State } from '../../../interfaces/state.js';
import { Context } from './core/context.js';
import { EndState } from './end.state.js';
import { UsernameState } from './username.state.js';

export class UsernameValidateState implements State {
    private context: Context;

    name: string;

    private interaction: CommandInteraction;

    constructor(context: Context, interaction: CommandInteraction) {
        this.context = context;
        this.interaction = interaction;
        this.name = 'USERNAME_VALIDATE_STATE';
    }

    async next(): Promise<void | null> {
        const message = this.context.getMessage();
        if (message!.content.trim().toLowerCase() === 'igen' || message!.content.trim().toLowerCase() === 'nem') {
            this.context.setState(new EndState(this.context, this.interaction));
            this.context.next();
        } else {
            this.context.setState(new UsernameState(this.context, this.interaction));
            this.context.next();
        }
    }
}