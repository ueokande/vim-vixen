export default class CompletionsRepository {
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
