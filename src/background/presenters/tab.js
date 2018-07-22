export default class TabPresenter {
  create(url) {
    browser.tabs.create({ url, });
  }

  onSelected(listener) {
    browser.tabs.onActivated.addListener(listener);
  }
}
