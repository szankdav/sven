import { CommandInteraction } from 'discord.js';
import { State } from '../../../interfaces/state.js';
import { Context } from './core/context.js';
import { UsernameValidateState } from './usernameValidate.state.js';


export class UsernameState implements State {
    private context: Context;

    name: string;

    private interaction: CommandInteraction;

    constructor(context: Context, interaction: CommandInteraction) {
        this.context = context;
        this.interaction = interaction;
        this.name = 'USERNAME_STATE';
    }

    async next(): Promise<void | null> {
        await this.interaction.user.send(`A megadott felhasználónév: ${this.context.getAdminUsername()}. Jól írtad be, mentsük el? (Kérlek igen vagy nem szóval válaszolj!)`);
        this.context.setState(new UsernameValidateState(this.context, this.interaction));
    };
}