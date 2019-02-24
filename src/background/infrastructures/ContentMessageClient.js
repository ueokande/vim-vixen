import messages from '../../shared/messages';

export default class ContentMessageClient {
  async broadcastSettingsChanged() {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs) {
      if (tab.url.startsWith('about:')) {
        continue;
      }
      browser.tabs.sendMessage(tab.id, {
        type: messages.SETTINGS_CHANGED,
      });
    }
  }

  async getAddonEnabled(tabId) {
    let { enabled } = await browser.tabs.sendMessage(tabId, {
      type: messages.ADDON_ENABLED_QUERY,
    });
    return enabled;
  }

  toggleAddonEnabled(tabId) {
    return browser.tabs.sendMessage(tabId, {
      type: messages.ADDON_TOGGLE_ENABLED,
    });
  }

  scrollTo(tabId, x, y) {
    return browser.tabs.sendMessage(tabId, {
      type: messages.TAB_SCROLL_TO,
      x,
      y,
    });
  }
}
