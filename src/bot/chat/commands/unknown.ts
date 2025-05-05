import { Command } from '../../interfaces/types.js';

export const unknownCommand: Command = {
    name: 'unknown',
    keywords: [],
    execute: () => 'Sajnálom, erre még nem tudok válaszolni. :(',
  };