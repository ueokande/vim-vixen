import { injectable } from 'tsyringe';
import CompletionsUseCase from '../usecases/CompletionsUseCase';
import CommandUseCase from '../usecases/CommandUseCase';
import CompletionGroup from '../domains/CompletionGroup';

const trimStart = (str: string): string => {
  // NOTE String.trimStart is available on Firefox 61
  return str.replace(/^\s+/, '');
};

@injectable()
export default class CommandController {
  constructor(
    private completionsUseCase: CompletionsUseCase,
    private commandIndicator: CommandUseCase,
  ) {
  }

  getCompletions(line: string): Promise<CompletionGroup[]> {
    let trimmed = trimStart(line);
    let words = trimmed.split(/ +/);
    let name = words[0];
    if (words.length === 1) {
      return this.completionsUseCase.queryConsoleCommand(name);
    }
    let keywords = trimStart(trimmed.slice(name.length));
    switch (words[0]) {
    case 'o':
    case 'open':
    case 't':
    case 'tabopen':
    case 'w':
    case 'winopen':
      return this.completionsUseCase.queryOpen(name, keywords);
    case 'b':
    case 'buffer':
      return this.completionsUseCase.queryBuffer(name, keywords);
    case 'bd':
    case 'bdel':
    case 'bdelete':
    case 'bdeletes':
      return this.completionsUseCase.queryBdelete(name, keywords);
    case 'bd!':
    case 'bdel!':
    case 'bdelete!':
    case 'bdeletes!':
      return this.completionsUseCase.queryBdeleteForce(name, keywords);
    case 'set':
      return this.completionsUseCase.querySet(name, keywords);
    }
    return Promise.resolve([]);
  }

  // eslint-disable-next-line complexity
  exec(line: string): Promise<any> {
    let trimmed = trimStart(line);
    let words = trimmed.split(/ +/);
    let name = words[0];
    if (words[0].length === 0) {
      return Promise.resolve();
    }

    let keywords = trimStart(trimmed.slice(name.length));
    switch (words[0]) {
    case 'o':
    case 'open':
      return this.commandIndicator.open(keywords);
    case 't':
    case 'tabopen':
      return this.commandIndicator.tabopen(keywords);
    case 'w':
    case 'winopen':
      return this.commandIndicator.winopen(keywords);
    case 'b':
    case 'buffer':
      return this.commandIndicator.buffer(keywords);
    case 'bd':
    case 'bdel':
    case 'bdelete':
      return this.commandIndicator.bdelete(false, keywords);
    case 'bd!':
    case 'bdel!':
    case 'bdelete!':
      return this.commandIndicator.bdelete(true, keywords);
    case 'bdeletes':
      return this.commandIndicator.bdeletes(false, keywords);
    case 'bdeletes!':
      return this.commandIndicator.bdeletes(true, keywords);
    case 'addbookmark':
      return this.commandIndicator.addbookmark(keywords);
    case 'q':
    case 'quit':
      return this.commandIndicator.quit();
    case 'qa':
    case 'quitall':
      return this.commandIndicator.quitAll();
    case 'set':
      return this.commandIndicator.set(keywords);
    case 'h':
    case 'help':
      return this.commandIndicator.help();
    }
    throw new Error(words[0] + ' command is not defined');
  }
}
