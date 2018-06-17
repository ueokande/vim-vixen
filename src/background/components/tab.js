import * as tabActions from '../actions/tab';

export default class TabComponent {
  constructor(store) {
    this.store = store;

    browser.tabs.onActivated.addListener(async(info) => {
      await browser.tabs.query({ currentWindow: true });
      return this.onTabActivated(info);
    });
  }

  onTabActivated(info) {
    return this.store.dispatch(tabActions.selected(info.tabId));
  }
}
