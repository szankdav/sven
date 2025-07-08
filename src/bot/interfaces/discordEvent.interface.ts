import { User } from 'discord.js';

export interface DiscordEvent {
    title: string;
    description: string;
    date: Date;
    entityType: string,
    channel: string | undefined,
    owner: User
};