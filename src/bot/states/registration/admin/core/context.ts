import { Message, OmitPartialGroupDMChannel } from 'discord.js';
import { State } from '../../../../interfaces/state.js';

export class Context {
    private state: State | null;

    private message: OmitPartialGroupDMChannel<Message<boolean>> | undefined;

    constructor() {
        this.state = null;
        this.message = undefined;
    }

    async next(): Promise<void | null> {
        this.state?.next();
    }

    public setState(state: State | null) {
        this.state = state;
    }

    public getState() {
        return this.state;
    }

    public getStateName() {
        return this.state?.name;
    }

    public setMessage(message: OmitPartialGroupDMChannel<Message<boolean>>){
        this.message = message;
    }

    public getMessage(){
        return this.message;
    }
}