import messages from 'shared/messages';
import * as operationActions from 'background/actions/operation';
import * as settingsActions from 'settings/actions/setting';
import * as tabActions from 'background/actions/tab';
import * as commands from 'shared/commands';

export default class BackgroundComponent {
  constructor(store) {
    this.store = store;
    this.setting = {};

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

  update() {
    this.settings = this.store.getState();
  }

  onMessage(message, sender) {
    switch (message.type) {
    case messages.BACKGROUND_OPERATION:
      return this.store.dispatch(
        operationActions.exec(message.operation, sender.tab),
        sender);
    case messages.OPEN_URL:
      if (message.background) {
        return this.store.dispatch(
          tabActions.openBackground(message.url), sender);
      } else if (message.newTab) {
        return this.store.dispatch(
          tabActions.openNewTab(message.url), sender);
      }
      return this.store.dispatch(
        tabActions.openToTab(message.url, sender.tab), sender);
    case messages.CONSOLE_BLURRED:
      return browser.tabs.sendMessage(sender.tab.id, {
        type: messages.CONSOLE_HIDE_COMMAND,
      });
    case messages.CONSOLE_ENTERED:
      return commands.exec(message.text, this.settings.value).catch((e) => {
        return browser.tabs.sendMessage(sender.tab.id, {
          type: messages.CONSOLE_SHOW_ERROR,
          text: e.message,
        });
      });
    case messages.SETTINGS_QUERY:
      return Promise.resolve(this.store.getState().value);
    case messages.CONSOLE_QUERY_COMPLETIONS:
      return commands.complete(message.text, this.settings.value);
    case messages.SETTINGS_RELOAD:
      this.store.dispatch(settingsActions.load());
      return this.broadcastSettingsChanged();
    }
  }

  broadcastSettingsChanged() {
    return browser.tabs.query({}).then((tabs) => {
      for (let tab of tabs) {
        browser.tabs.sendMessage(tab.id, {
          type: messages.SETTINGS_CHANGED,
        });
      }
    });
  }
}
