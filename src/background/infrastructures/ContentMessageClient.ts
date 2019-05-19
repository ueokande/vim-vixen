import * as messages from '../../shared/messages';

export default class ContentMessageClient {
  async broadcastSettingsChanged(): Promise<void> {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs) {
      if (!tab.id || tab.url && tab.url.startsWith('about:')) {
        continue;
      }
      browser.tabs.sendMessage(tab.id, {
        type: messages.SETTINGS_CHANGED,
      });
    }
  }

  async getAddonEnabled(tabId: number): Promise<boolean> {
    let enabled = await browser.tabs.sendMessage(tabId, {
      type: messages.ADDON_ENABLED_QUERY,
    });
    return enabled as any as boolean;
  }

  toggleAddonEnabled(tabId: number): Promise<void> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.ADDON_TOGGLE_ENABLED,
    });
  }

  scrollTo(tabId: number, x: number, y: number): Promise<void> {
    return browser.tabs.sendMessage(tabId, {
      type: messages.TAB_SCROLL_TO,
      x,
      y,
    });
  }
}
