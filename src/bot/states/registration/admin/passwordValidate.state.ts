import { CommandInteraction } from 'discord.js';
import { State } from '../../../interfaces/state.js';
import { Context } from './core/context.js';
import { EndState } from './end.state.js';
import { PasswordState } from './password.state.js';

export class PasswordValidateState implements State {
    private context: Context;

    name: string;

    private interaction: CommandInteraction;

    constructor(context: Context, interaction: CommandInteraction) {
        this.context = context;
        this.interaction = interaction;
        this.name = 'PASSWORD_VALIDATE_STATE';
    }

    async next(): Promise<void | null> {
        const message = this.context.getMessage();
        const password = this.context.getAdminPassword();
        if (message?.content.trim() === password) {
            this.context.setState(new EndState(this.context, this.interaction));
            this.context.next();
        } else {
            this.context.setAdminPassword('');
            await this.interaction.user.send('A két jelszó amit beírtál, nem egyezik. Semmi gond, kezdjük elölről! :nerd:');
            this.context.setState(new PasswordState(this.context, this.interaction));
            this.context.next();
        }

    }
}