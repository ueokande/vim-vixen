export default class TabPresenter {
  open(url, tabId) {
    return browser.tabs.update(tabId, { url });
  }

  create(url, { openerTabId, active }) {
    return browser.tabs.create({ url, openerTabId, active });
  }

  async createAdjacent(url, { openerTabId, active }) {
    let tabs = await browser.tabs.query({
      active: true, currentWindow: true
    });
    return browser.tabs.create({
      url,
      openerTabId,
      active,
      index: tabs[0].index + 1
    });
  }

  onSelected(listener) {
    browser.tabs.onActivated.addListener(listener);
  }
}
