export default class TabRepository {
  create(url) {
    browser.tabs.create({ url, });
  }
}
