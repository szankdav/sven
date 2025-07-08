export interface Command {
    name: string;
    keywords: string[];
    execute: () => string;
  }
  