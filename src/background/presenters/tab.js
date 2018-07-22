export default class TabPresenter {
  create(url) {
    browser.tabs.create({ url, });
  }
}
