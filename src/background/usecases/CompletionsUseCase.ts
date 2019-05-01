import CompletionGroup from '../domains/CompletionGroup';
import CommandDocs from '../domains/CommandDocs';
import CompletionsRepository from '../repositories/CompletionsRepository';
import * as filters from './filters';
import SettingRepository from '../repositories/SettingRepository';
import TabPresenter from '../presenters/TabPresenter';
import * as properties from '../../shared/settings/properties';

const COMPLETION_ITEM_LIMIT = 10;

type Tab = browser.tabs.Tab;
type HistoryItem = browser.history.HistoryItem;

export default class CompletionsUseCase {
  private tabPresenter: TabPresenter;

  private completionsRepository: CompletionsRepository;

  private settingRepository: SettingRepository;

  constructor() {
    this.tabPresenter = new TabPresenter();
    this.completionsRepository = new CompletionsRepository();
    this.settingRepository = new SettingRepository();
  }

  queryConsoleCommand(prefix: string): Promise<CompletionGroup[]> {
    let keys = Object.keys(CommandDocs);
    let items = keys
      .filter(name => name.startsWith(prefix))
      .map(name => ({
        caption: name,
        content: name,
        url: CommandDocs[name],
      }));

    if (items.length === 0) {
      return Promise.resolve([]);
    }
    return Promise.resolve([{ name: 'Console Command', items }]);
  }

  async queryOpen(name: string, keywords: string): Promise<CompletionGroup[]> {
    let settings = await this.settingRepository.get();
    let groups: CompletionGroup[] = [];

    let complete = settings.properties.complete || properties.defaults.complete;
    for (let c of complete) {
      if (c === 's') {
        // eslint-disable-next-line no-await-in-loop
        let engines = await this.querySearchEngineItems(name, keywords);
        if (engines.length > 0) {
          groups.push({ name: 'Search Engines', items: engines });
        }
      } else if (c === 'h') {
        // eslint-disable-next-line no-await-in-loop
        let histories = await this.queryHistoryItems(name, keywords);
        if (histories.length > 0) {
          groups.push({ name: 'History', items: histories });
        }
      } else if (c === 'b') {
        // eslint-disable-next-line no-await-in-loop
        let bookmarks = await this.queryBookmarkItems(name, keywords);
        if (bookmarks.length > 0) {
          groups.push({ name: 'Bookmarks', items: bookmarks });
        }
      }
    }
    return groups;
  }

  // eslint-disable-next-line max-statements
  async queryBuffer(
    name: string,
    keywords: string,
  ): Promise<CompletionGroup[]> {
    let lastId = await this.tabPresenter.getLastSelectedId();
    let trimmed = keywords.trim();
    let tabs: Tab[] = [];
    if (trimmed.length > 0 && !isNaN(Number(trimmed))) {
      let all = await this.tabPresenter.getAll();
      let index = parseInt(trimmed, 10) - 1;
      if (index >= 0 && index < all.length) {
        tabs = [all[index]];
      }
    } else if (trimmed === '%') {
      let all = await this.tabPresenter.getAll();
      let tab = all.find(t => t.active) as Tab;
      tabs = [tab];
    } else if (trimmed === '#') {
      if (typeof lastId !== 'undefined' && lastId !== null) {
        let all = await this.tabPresenter.getAll();
        let tab = all.find(t => t.id === lastId) as Tab;
        tabs = [tab];
      }
    } else {
      tabs = await this.completionsRepository.queryTabs(keywords, false);
    }
    const flag = (tab: Tab) => {
      if (tab.active) {
        return '%';
      } else if (tab.id === lastId) {
        return '#';
      }
      return ' ';
    };
    let items = tabs.map(tab => ({
      caption: tab.index + 1 + ': ' + flag(tab) + ' ' + tab.title,
      content: name + ' ' + tab.title,
      url: tab.url,
      icon: tab.favIconUrl,
    }));
    if (items.length === 0) {
      return Promise.resolve([]);
    }
    return [{ name: 'Buffers', items }];
  }

  queryBdelete(name: string, keywords: string): Promise<CompletionGroup[]> {
    return this.queryTabs(name, true, keywords);
  }

  queryBdeleteForce(
    name: string, keywords: string,
  ): Promise<CompletionGroup[]> {
    return this.queryTabs(name, false, keywords);
  }

  querySet(name: string, keywords: string): Promise<CompletionGroup[]> {
    let items = Object.keys(properties.docs).map((key) => {
      if (properties.types[key] === 'boolean') {
        return [
          {
            caption: key,
            content: name + ' ' + key,
            url: 'Enable ' + properties.docs[key],
          }, {
            caption: 'no' + key,
            content: name + ' no' + key,
            url: 'Disable ' + properties.docs[key],
          }
        ];
      }
      return [
        {
          caption: key,
          content: name + ' ' + key,
          url: 'Set ' + properties.docs[key],
        }
      ];
    });
    let flatten = items.reduce((acc, val) => acc.concat(val), []);
    flatten = flatten.filter((item) => {
      return item.caption.startsWith(keywords);
    });
    if (flatten.length === 0) {
      return Promise.resolve([]);
    }
    return Promise.resolve(
      [{ name: 'Properties', items: flatten }],
    );
  }

  async queryTabs(
    name: string, excludePinned: boolean, args: string,
  ): Promise<CompletionGroup[]> {
    let tabs = await this.completionsRepository.queryTabs(args, excludePinned);
    let items = tabs.map(tab => ({
      caption: tab.title,
      content: name + ' ' + tab.title,
      url: tab.url,
      icon: tab.favIconUrl
    }));
    if (items.length === 0) {
      return Promise.resolve([]);
    }
    return [{ name: 'Buffers', items }];
  }

  async querySearchEngineItems(name: string, keywords: string) {
    let settings = await this.settingRepository.get();
    let engines = Object.keys(settings.search.engines)
      .filter(key => key.startsWith(keywords));
    return engines.map(key => ({
      caption: key,
      content: name + ' ' + key,
    }));
  }

  async queryHistoryItems(name: string, keywords: string) {
    let histories = await this.completionsRepository.queryHistories(keywords);
    histories = [histories]
      .map(filters.filterBlankTitle)
      .map(filters.filterHttp)
      .map(filters.filterByTailingSlash)
      .map(pages => filters.filterByPathname(pages, COMPLETION_ITEM_LIMIT))
      .map(pages => filters.filterByOrigin(pages, COMPLETION_ITEM_LIMIT))[0]
      .sort((x: HistoryItem, y: HistoryItem) => {
        return Number(x.visitCount) < Number(y.visitCount);
      })
      .slice(0, COMPLETION_ITEM_LIMIT);
    return histories.map(page => ({
      caption: page.title,
      content: name + ' ' + page.url,
      url: page.url
    }));
  }

  async queryBookmarkItems(name: string, keywords: string) {
    let bookmarks = await this.completionsRepository.queryBookmarks(keywords);
    return bookmarks.slice(0, COMPLETION_ITEM_LIMIT)
      .map(page => ({
        caption: page.title,
        content: name + ' ' + page.url,
        url: page.url
      }));
  }
}
