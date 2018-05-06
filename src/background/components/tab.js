import * as tabActions from '../actions/tab';

export default class TabComponent {
  constructor(store) {
    this.store = store;

    browser.tabs.onActivated.addListener((info) => {
      return browser.tabs.query({ currentWindow: true }).then(() => {
        return this.onTabActivated(info);
      });
    });
  }

  onTabActivated(info) {
    return this.store.dispatch(tabActions.selected(info.tabId));
  }
}
