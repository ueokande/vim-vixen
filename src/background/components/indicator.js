import * as indicators from '../shared/indicators';
import messages from 'shared/messages';

export default class IndicatorComponent {
  constructor(store) {
    this.store = store;

    messages.onMessage(this.onMessage.bind(this));

    browser.browserAction.onClicked.addListener(this.onClicked);
    browser.tabs.onActivated.addListener(async(info) => {
      await browser.tabs.query({ currentWindow: true });
      return this.onTabActivated(info);
    });
  }

  async onTabActivated(info) {
    let { enabled } = await browser.tabs.sendMessage(info.tabId, {
      type: messages.ADDON_ENABLED_QUERY,
    });
    return this.updateIndicator(enabled);
  }

  onClicked(tab) {
    browser.tabs.sendMessage(tab.id, {
      type: messages.ADDON_TOGGLE_ENABLED,
    });
  }

  onMessage(message) {
    switch (message.type) {
    case messages.ADDON_ENABLED_RESPONSE:
      return this.updateIndicator(message.enabled);
    }
  }

  updateIndicator(enabled) {
    if (enabled) {
      return indicators.enable();
    }
    return indicators.disable();
  }
}
