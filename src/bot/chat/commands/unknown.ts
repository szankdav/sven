import { Command } from '../../interfaces/types.interface.js';

export const unknownCommand: Command = {
    name: 'unknown',
    keywords: [],
    execute: () => 'Sajnálom, erre még nem tudok válaszolni. :(',
  };