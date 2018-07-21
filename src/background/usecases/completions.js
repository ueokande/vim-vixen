import CompletionItem from '../domains/completion-item';
import CompletionGroup from '../domains/completion-group';
import Completions from '../domains/completions';
import CompletionRepository from '../repositories/completions';
import CommandDocs from 'background/shared/commands/docs';

export default class CompletionsInteractor {
  constructor() {
    this.completionRepository = new CompletionRepository();
  }

  queryConsoleCommand(prefix) {
    let keys = Object.keys(CommandDocs);
    let items = keys
      .filter(name => name.startsWith(prefix))
      .map(name => ({
        caption: name,
        content: name,
        url: CommandDocs[name],
      }));

    if (items.length === 0) {
      return Promise.resolve(Completions.empty());
    }
    return Promise.resolve(
      new Completions([new CompletionGroup('Console Command', items)])
    );
  }

  queryOpen() {
    return Promise.resolve(Completions.empty());
  }

  queryBuffer(name, keywords) {
    return this.queryTabs(name, true, keywords);
  }

  queryBdelete(name, keywords) {
    return this.queryTabs(name, true, keywords);
  }

  queryBdeleteForce(name, keywords) {
    return this.queryTabs(name, false, keywords);
  }

  querySet() {
    return Promise.resolve(Completions.empty());
  }

  async queryTabs(name, excludePinned, args) {
    let tabs = await this.completionRepository.queryTabs(args, excludePinned);
    let items = tabs.map(tab => new CompletionItem({
      caption: tab.title,
      content: name + ' ' + tab.title,
      url: tab.url,
      icon: tab.favIconUrl
    }));
    return new Completions([new CompletionGroup('Buffers', items)]);
  }
}
