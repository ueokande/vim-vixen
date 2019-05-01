export default class WindowPresenter {
  create(url: string): Promise<browser.windows.Window> {
    return browser.windows.create({ url });
  }
}
