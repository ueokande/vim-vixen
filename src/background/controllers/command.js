import CompletionsInteractor from '../usecases/completions';
import CommandInteractor from '../usecases/command';
import Completions from '../domains/completions';

export default class CommandController {
  constructor() {
    this.completionsInteractor = new CompletionsInteractor();
    this.commandIndicator = new CommandInteractor();
  }

  getCompletions(line) {
    let trimmed = line.trimStart();
    let words = trimmed.split(/ +/);
    let name = words[0];
    if (words.length === 1) {
      return this.completionsInteractor.queryConsoleCommand(name);
    }
    let keywords = trimmed.slice(name.length).trimStart();
    switch (words[0]) {
    case 'o':
    case 'open':
    case 't':
    case 'tabopen':
    case 'w':
    case 'winopen':
      return this.completionsInteractor.queryOpen(name, keywords);
    case 'b':
    case 'buffer':
      return this.completionsInteractor.queryBuffer(name, keywords);
    case 'bd':
    case 'bdel':
    case 'bdelete':
    case 'bdeletes':
      return this.completionsInteractor.queryBdelete(name, keywords);
    case 'bd!':
    case 'bdel!':
    case 'bdelete!':
    case 'bdeletes!':
      return this.completionsInteractor.queryBdeleteForce(name, keywords);
    case 'set':
      return this.completionsInteractor.querySet(name, keywords);
    }
    return Promise.resolve(Completions.empty());
  }

  // eslint-disable-next-line complexity
  exec(line) {
    let trimmed = line.trimStart();
    let words = trimmed.split(/ +/);
    let name = words[0];
    let keywords = trimmed.slice(name.length).trimStart();
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
    }
  }
}
