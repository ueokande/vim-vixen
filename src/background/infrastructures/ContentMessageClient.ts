import { injectable } from "tsyringe";
import * as messages from "../../shared/messages";

@injectable()
export default class ContentMessageClient {
  async broadcastSettingsChanged(): Promise<void> {
    const tabs = await browser.tabs.query({});
    for (const tab of tabs) {
      if (!tab.id || (tab.url && tab.url.startsWith("about:"))) {
        continue;
      }
      browser.tabs.sendMessage(tab.id, {
        type: messages.SETTINGS_CHANGED,
      });
    }
  }

  async getAddonEnabled(tabId: number): Promise<boolean> {
    const enabled = await browser.tabs.sendMessage(tabId, {
      type: messages.ADDON_ENABLED_QUERY,
    });
    return enabled as any as boolean;
  }

  async toggleAddonEnabled(tabId: number): Promise<void> {
    await browser.tabs.sendMessage(tabId, {
      type: messages.ADDON_TOGGLE_ENABLED,
    });
  }

  async scrollTo(tabId: number, x: number, y: number): Promise<void> {
    await browser.tabs.sendMessage(tabId, {
      type: messages.TAB_SCROLL_TO,
      x,
      y,
    });
  }
}
