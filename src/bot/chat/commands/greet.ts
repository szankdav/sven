import { Command } from '../../interfaces/types.js';

export const greetCommand: Command = {
    name: 'greet',
    keywords: ['hello', 'hi', 'szia'],
    execute: () => 'Szia! Kérdezz, és ha tudok, válaszolok!',
  };