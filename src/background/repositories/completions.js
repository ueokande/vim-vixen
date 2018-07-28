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

  queryHistories(keywords) {
    return browser.history.search({
      text: keywords,
      startTime: 0,
    });
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
