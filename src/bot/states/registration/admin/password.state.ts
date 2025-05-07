import { CommandInteraction } from 'discord.js';
import { State } from '../../../interfaces/state.js';
import { Context } from './core/context.js';
import { PasswordValidateState } from './passwordValidate.state.js';

export const PASSWORD_MSG = 'Kérlek add meg a jelszót, amivel regisztrálni szeretnél! Biztonsági megfontoltságból írd a jelszavat két dupla vonal (||) közé. Magyar billentyűzeten ezt az alt + w kombinációval tudod beírni. Ezáltal nem lesz látható, amit beírsz, csak ha rákattintasz.';

export class PasswordState implements State {
    private context: Context;

    name: string;

    private interaction: CommandInteraction;

    constructor(context: Context, interaction: CommandInteraction) {
        this.context = context;
        this.interaction = interaction;
        this.name = 'PASSWORD_STATE';
    }

    async next(): Promise<void | null> {
        if (this.context.getAdminPassword() !== '') {
            this.context.setState(new PasswordValidateState(this.context, this.interaction));
            this.interaction.user.send('Kérlek add meg újra a jelszót!');
        } else {
            await this.interaction.user.send(PASSWORD_MSG);
        }
    }
}