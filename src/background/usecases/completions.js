import CompletionItem from '../domains/completion-item';
import CompletionGroup from '../domains/completion-group';
import Completions from '../domains/completions';
import CommandDocs from '../domains/command-docs';
import CompletionRepository from '../repositories/completions';
import * as filters from './filters';
import SettingRepository from '../repositories/setting';
import TabPresenter from '../presenters/tab';
import * as properties from '../../shared/settings/properties';

const COMPLETION_ITEM_LIMIT = 10;

export default class CompletionsInteractor {
  constructor() {
    this.tabPresenter = new TabPresenter();
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
    let settings = await this.settingRepository.get();
    let groups = [];

    for (let c of settings.properties.complete) {
      if (c === 's') {
        // eslint-disable-next-line no-await-in-loop
        let engines = await this.querySearchEngineItems(name, keywords);
        if (engines.length > 0) {
          groups.push(new CompletionGroup('Search Engines', engines));
        }
      } else if (c === 'h') {
        // eslint-disable-next-line no-await-in-loop
        let histories = await this.queryHistoryItems(name, keywords);
        if (histories.length > 0) {
          groups.push(new CompletionGroup('History', histories));
        }
      } else if (c === 'b') {
        // eslint-disable-next-line no-await-in-loop
        let bookmarks = await this.queryBookmarkItems(name, keywords);
        if (bookmarks.length > 0) {
          groups.push(new CompletionGroup('Bookmarks', bookmarks));
        }
      }
    }
    return new Completions(groups);
  }

  // eslint-disable-next-line max-statements
  async queryBuffer(name, keywords) {
    let lastId = await this.tabPresenter.getLastSelectedId();
    let trimmed = keywords.trim();
    let tabs = [];
    if (trimmed.length > 0 && !isNaN(trimmed)) {
      let all = await this.tabPresenter.getAll();
      let index = parseInt(trimmed, 10) - 1;
      if (index >= 0 && index < all.length) {
        tabs = [all[index]];
      }
    } else if (trimmed === '%') {
      let all = await this.tabPresenter.getAll();
      let tab = all.find(t => t.active);
      tabs = [tab];
    } else if (trimmed === '#') {
      if (typeof lastId !== 'undefined' && lastId !== null) {
        let all = await this.tabPresenter.getAll();
        let tab = all.find(t => t.id === lastId);
        tabs = [tab];
      }
    } else {
      tabs = await this.completionRepository.queryTabs(keywords, false);
    }
    const flag = (tab) => {
      if (tab.active) {
        return '%';
      } else if (tab.id === lastId) {
        return '#';
      }
      return ' ';
    };
    let items = tabs.map(tab => new CompletionItem({
      caption: tab.index + 1 + ': ' + flag(tab) + ' ' + tab.title,
      content: name + ' ' + tab.title,
      url: tab.url,
      icon: tab.favIconUrl
    }));
    if (items.length === 0) {
      return Promise.resolve(Completions.empty());
    }
    return new Completions([new CompletionGroup('Buffers', items)]);
  }

  queryBdelete(name, keywords) {
    return this.queryTabs(name, true, keywords);
  }

  queryBdeleteForce(name, keywords) {
    return this.queryTabs(name, false, keywords);
  }

  querySet(name, keywords) {
    let items = Object.keys(properties.docs).map((key) => {
      if (properties.types[key] === 'boolean') {
        return [
          new CompletionItem({
            caption: key,
            content: name + ' ' + key,
            url: 'Enable ' + properties.docs[key],
          }),
          new CompletionItem({
            caption: 'no' + key,
            content: name + ' no' + key,
            url: 'Disable ' + properties.docs[key],
          }),
        ];
      }
      return [
        new CompletionItem({
          caption: key,
          content: name + ' ' + key,
          url: 'Set ' + properties.docs[key],
        })
      ];
    });
    items = items.reduce((acc, val) => acc.concat(val), []);
    items = items.filter((item) => {
      return item.caption.startsWith(keywords);
    });
    if (items.length === 0) {
      return Promise.resolve(Completions.empty());
    }
    return Promise.resolve(
      new Completions([new CompletionGroup('Properties', items)])
    );
  }

  async queryTabs(name, excludePinned, args) {
    let tabs = await this.completionRepository.queryTabs(args, excludePinned);
    let items = tabs.map(tab => new CompletionItem({
      caption: tab.title,
      content: name + ' ' + tab.title,
      url: tab.url,
      icon: tab.favIconUrl
    }));
    if (items.length === 0) {
      return Promise.resolve(Completions.empty());
    }
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
    return bookmarks.slice(0, COMPLETION_ITEM_LIMIT)
      .map(page => new CompletionItem({
        caption: page.title,
        content: name + ' ' + page.url,
        url: page.url
      }));
  }
}
