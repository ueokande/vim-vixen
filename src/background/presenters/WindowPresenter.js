export default class WindowPresenter {
  create(url) {
    return browser.windows.create({ url });
  }
}
