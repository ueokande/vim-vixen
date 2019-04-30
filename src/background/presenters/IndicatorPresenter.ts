export default class IndicatorPresenter {
  indicate(enabled) {
    let path = enabled
      ? 'resources/enabled_32x32.png'
      : 'resources/disabled_32x32.png';
    return browser.browserAction.setIcon({ path });
  }

  onClick(listener) {
    browser.browserAction.onClicked.addListener(listener);
  }
}
