import { Command } from "../../shared/Command";

export class UnknownCommandError extends Error {
  constructor(value: string) {
    super(`unknown command '${value}'`);
  }
}

export default class CommandParser {
  parse(value: string): Command {
    switch (value) {
    case 'o':
    case 'open':
      return Command.Open;
    case 't':
    case 'tabopen':
      return Command.TabOpen;
    case 'w':
    case 'winopen':
      return Command.WindowOpen;
    case 'b':
    case 'buffer':
      return Command.Buffer;
    case 'bd':
    case 'bdel':
    case 'bdelete':
      return Command.BufferDelete;
    case 'bd!':
    case 'bdel!':
    case 'bdelete!':
      return Command.BufferDeleteForce;
    case 'bdeletes':
      return Command.BuffersDelete;
    case 'bdeletes!':
      return Command.BuffersDeleteForce;
    case 'addbookmark':
      return Command.AddBookmark;
    case 'q':
    case 'quit':
      return Command.Quit;
    case 'qa':
    case 'quitall':
      return Command.QuitAll;
    case 'set':
      return Command.Set;
    case 'h':
    case 'help':
      return Command.Help;
    }
    throw new UnknownCommandError(value);
  }
}
