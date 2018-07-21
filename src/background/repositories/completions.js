export default class CompletionsRepository {
  async queryBookmarks(keywords) {
    let items = await browser.bookmarks.search({ query: keywords });
    return items.filter((item) => {
      let url = undefined;
      try {
        url = new URL(item.url);
      } catch (e) {
        return false;
      }
      return item.type === 'bookmark' && url.protocol !== 'place:';
    });
  }

  // eslint-disable-next-line complexity, max-lines-per-function
  async queryHistories(keywords) {
    const filterHttp = (items) => {
      const httpsHosts = items
        .filter(item => item[1].protocol === 'https:')
        .map(item => item[1].host);
      const httpsHostSet = new Set(httpsHosts);
      return items.filter(
        item => !(item[1].protocol === 'http:' &&
          httpsHostSet.has(item[1].host))
      );
    };

    const filterEmptyTitle = (items) => {
      return items.filter(item => item[0].title && item[0].title !== '');
    };

    const filterClosedPath = (items) => {
      const allSimplePaths = items
        .filter(item => item[1].hash === '' && item[1].search === '')
        .map(item => item[1].origin + item[1].pathname);
      const allSimplePathSet = new Set(allSimplePaths);
      return items.filter(
        item => !(item[1].hash === '' && item[1].search === '' &&
          (/\/$/).test(item[1].pathname) &&
          allSimplePathSet.has(
            (item[1].origin + item[1].pathname).replace(/\/$/, '')
          )
        )
      );
    };

    const reduceByPathname = (items, min) => {
      let hash = {};
      for (let item of items) {
        let pathname = item[1].origin + item[1].pathname;
        if (!hash[pathname]) {
          hash[pathname] = item;
        } else if (hash[pathname][1].href.length > item[1].href.length) {
          hash[pathname] = item;
        }
      }
      let filtered = Object.values(hash);
      if (filtered.length < min) {
        return items;
      }
      return filtered;
    };

    const reduceByOrigin = (items, min) => {
      let hash = {};
      for (let item of items) {
        let origin = item[1].origin;
        if (!hash[origin]) {
          hash[origin] = item;
        } else if (hash[origin][1].href.length > item[1].href.length) {
          hash[origin] = item;
        }
      }
      let filtered = Object.values(hash);
      if (filtered.length < min) {
        return items;
      }
      return filtered;
    };


    let historyItems = await browser.history.search({
      text: keywords,
      startTime: 0,
    });
    return [historyItems.map(item => [item, new URL(item.url)])]
      .map(filterEmptyTitle)
      .map(filterHttp)
      .map(filterClosedPath)
      .map(items => reduceByPathname(items, 10))
      .map(items => reduceByOrigin(items, 10))
      .map(items => items
        .sort((x, y) => x[0].visitCount < y[0].visitCount)
        .slice(0, 10)
        .map(item => item[0])
      )[0];
  }

  async queryTabs(keywords, excludePinned) {
    let tabs = await browser.tabs.query({ currentWindow: true });
    return tabs.filter((t) => {
      return t.url.toLowerCase().includes(keywords.toLowerCase()) ||
        t.title && t.title.toLowerCase().includes(keywords.toLowerCase());
    }).filter((t) => {
      return !(excludePinned && t.pinned);
    });
  }
}
