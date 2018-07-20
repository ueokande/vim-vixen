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
    switch (words[0]) {
    case 'o':
    case 'open':
    case 't':
    case 'tabopen':
    case 'w':
    case 'winopen':
      break;
    case 'b':
    case 'buffer':
      break;
    case 'bd!':
    case 'bdel!':
    case 'bdelete!':
    case 'bdeletes!':
      break;
    case 'bd':
    case 'bdel':
    case 'bdelete':
    case 'bdeletes':
      break;
    case 'set':
      break;
    }
    return Promise.resolve(Completions.empty());
  }
}
