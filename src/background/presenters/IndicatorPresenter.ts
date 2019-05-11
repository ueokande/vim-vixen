export default class IndicatorPresenter {
  indicate(enabled: boolean): Promise<void> {
    let path = enabled
      ? 'resources/enabled_32x32.png'
      : 'resources/disabled_32x32.png';
    return browser.browserAction.setIcon({ path });
  }

  onClick(listener: (arg: browser.tabs.Tab) => void): void {
    browser.browserAction.onClicked.addListener(listener);
  }
}
