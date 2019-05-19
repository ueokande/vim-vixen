import { injectable } from 'tsyringe';

@injectable()
export default class IndicatorPresenter {
  indicate(enabled: boolean): Promise<void> {
    let path = enabled
      ? 'resources/enabled_32x32.png'
      : 'resources/disabled_32x32.png';
    if (typeof browser.browserAction.setIcon === 'function') {
      return browser.browserAction.setIcon({ path });
    }

    // setIcon not supported on Android
    return Promise.resolve();

  }

  onClick(listener: (arg: browser.tabs.Tab) => void): void {
    browser.browserAction.onClicked.addListener(listener);
  }
}
