import CompletionItem from '../domains/completion-item';
import CompletionGroup from '../domains/completion-group';
import Completions from '../domains/completions';
import CompletionRepository from '../repositories/completions';
import CommandDocs from 'background/shared/commands/docs';
import * as filters from './filters';
import SettingRepository from '../repositories/setting';

const COMPLETION_ITEM_LIMIT = 10;

export default class CompletionsInteractor {
  constructor() {
    this.completionRepository = new CompletionRepository();
    this.settingRepository = new SettingRepository();
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
    let engines = await this.querySearchEngineItems(name, keywords);
    if (engines.length > 0) {
      groups.push(new CompletionGroup('Search Engines', engines));
    }
    let histories = await this.queryHistoryItems(name, keywords);
    if (histories.length > 0) {
      groups.push(new CompletionGroup('History', histories));
    }
    let bookmarks = await this.queryBookmarkItems(name, keywords);
    if (bookmarks.length > 0) {
      groups.push(new CompletionGroup('Bookmarks', bookmarks));
    }
    return new Completions(groups);
  }

  queryBuffer(name, keywords) {
    return this.queryTabs(name, false, keywords);
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

  async querySearchEngineItems(name, keywords) {
    let settings = await this.settingRepository.get();
    let engines = Object.keys(settings.search.engines)
      .filter(key => key.startsWith(keywords));
    return engines.map(key => new CompletionItem({
      caption: key,
      content: name + ' ' + key,
    }));
  }

  async queryHistoryItems(name, keywords) {
    let histories = await this.completionRepository.queryHistories(keywords);
    histories = [histories]
      .map(filters.filterBlankTitle)
      .map(filters.filterHttp)
      .map(filters.filterByTailingSlash)
      .map(pages => filters.filterByPathname(pages, COMPLETION_ITEM_LIMIT))
      .map(pages => filters.filterByOrigin(pages, COMPLETION_ITEM_LIMIT))[0]
      .sort((x, y) => x.visitCount < y.visitCount)
      .slice(0, COMPLETION_ITEM_LIMIT);
    return histories.map(page => new CompletionItem({
      caption: page.title,
      content: name + ' ' + page.url,
      url: page.url
    }));
  }

  async queryBookmarkItems(name, keywords) {
    let bookmarks = await this.completionRepository.queryBookmarks(keywords);
    return bookmarks.map(page => new CompletionItem({
      caption: page.title,
      content: name + ' ' + page.url,
      url: page.url
    }));
  }
}
