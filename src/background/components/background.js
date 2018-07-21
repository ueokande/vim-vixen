import messages from 'shared/messages';
import * as commandActions from 'background/actions/command';
import * as tabActions from 'background/actions/tab';

export default class BackgroundComponent {
  constructor(store) {
    this.store = store;

    browser.runtime.onMessage.addListener((message, sender) => {
      try {
        return this.onMessage(message, sender);
      } catch (e) {
        return browser.tabs.sendMessage(sender.tab.id, {
          type: messages.CONSOLE_SHOW_ERROR,
          text: e.message,
        });
      }
    });
  }

  onMessage(message, sender) {
    let settings = this.store.getState().setting;

    switch (message.type) {
    case messages.OPEN_URL:
      if (message.newTab) {
        let action = tabActions.openNewTab(
          message.url, sender.tab.id, message.background,
          settings.value.properties.adjacenttab);
        return this.store.dispatch(action);
      }
      return this.store.dispatch(tabActions.openToTab(message.url, sender.tab));
    case messages.CONSOLE_ENTER_COMMAND:
      this.store.dispatch(
        commandActions.exec(sender.tab, message.text, settings.value),
      );
      return this.broadcastSettingsChanged();
    }
  }

  async broadcastSettingsChanged() {
    let tabs = await browser.tabs.query({});
    for (let tab of tabs) {
      browser.tabs.sendMessage(tab.id, {
        type: messages.SETTINGS_CHANGED,
      });
    }
  }
}
