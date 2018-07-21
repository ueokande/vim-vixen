import CompletionsInteractor from '../usecases/completions';
import Completions from '../domains/completions';

export default class ContentMessageController {
  constructor() {
    this.completionsInteractor = new CompletionsInteractor();
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
}
