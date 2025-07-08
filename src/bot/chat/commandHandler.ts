import { Command } from '../interfaces/types.interface.js';
import { greetCommand } from './commands/greet.js';
import { unknownCommand } from './commands/unknown.js';

const commands: Command[] = [greetCommand];

export function handleInput(input: string): Command {
    const msg = input.toLowerCase();

    const commandByKeyword = commands.find((command) => command.keywords.some(keyword => msg.includes(keyword)));

    return commandByKeyword || unknownCommand;
};
