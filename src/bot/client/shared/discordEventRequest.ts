import { DiscordEvent } from '../../interfaces/discordEvent.interface';

let event: DiscordEvent;

const eventRequest = {
    get event(): DiscordEvent {
        return event;
    },

    set event(value: DiscordEvent) {
        event = value;
    },
};

export default eventRequest;