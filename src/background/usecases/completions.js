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

  async queryOpen(name, keywords) {
    let groups = [];
    let histories = await this.completionRepository.queryHistories(keywords);
    if (histories.length > 0) {
      let items = histories.map(page => new CompletionItem({
        caption: page.title,
        content: name + ' ' + page.url,
        url: page.url
      }));
      groups.push(new CompletionGroup('History', items));
    }

    let bookmarks = await this.completionRepository.queryBookmarks(keywords);
    if (bookmarks.length > 0) {
      let items = bookmarks.map(page => new CompletionItem({
        caption: page.title,
        content: name + ' ' + page.url,
        url: page.url
      }));
      groups.push(new CompletionGroup('Bookmarks', items));
    }
    return new Completions(groups);
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
