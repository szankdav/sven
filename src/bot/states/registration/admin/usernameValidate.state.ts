import { CommandInteraction } from 'discord.js';
import { State } from '../../../interfaces/state.js';
import { Context } from './core/context.js';
import { UsernameState } from './username.state.js';
import { StartState } from './start.state.js';
import { PasswordState } from './password.state.js';

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
        if (message!.content.trim().toLowerCase() === 'igen') {
            this.context.setState(new PasswordState(this.context, this.interaction));
            this.context.next();
        } else if (message!.content.trim().toLowerCase() === 'nem') {
            this.context.setAdminUsername('');
            await this.interaction.user.send('Rendben, semmi gond, javítjuk! :wink:');
            this.context.setState(new StartState(this.context, this.interaction));
            this.context.next();
        } 
        else {
            await this.interaction.user.send(':exclamation:Kérlek, hogy csak "Igen" vagy "Nem" szóval válaszolj.:exclamation: Ha más választ adsz, azt sajnos nem áll módomban elfogadni. :head_shaking_horizontally:');
            this.context.setState(new UsernameState(this.context, this.interaction));
            this.context.next();
        }
    }
}