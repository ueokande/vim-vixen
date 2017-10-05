import messages from 'content/messages';
import * as commandActions from 'actions/command';
import * as consoleActions from 'actions/console';
import * as inputActions from 'actions/input';
import * as settingsActions from 'actions/setting';
import * as tabActions from 'actions/tab';

export default class BackgroundComponent {
  constructor(store) {
    this.store = store;
    this.setting = {};

    browser.runtime.onMessage.addListener((message, sender) => {
      try {
        this.onMessage(message, sender);
      } catch (e) {
        this.store.dispatch(consoleActions.showError(e.message), sender);
      }
    });
  }

  update() {
    let state = this.store.getState();
    this.updateSettings(state.setting);
  }

  updateSettings(setting) {
    if (!setting.settings.json) {
      return;
    }
    this.settings = JSON.parse(setting.settings.json);
  }

  onMessage(message, sender) {
    switch (message.type) {
    case messages.KEYDOWN:
      return this.store.dispatch(
        inputActions.keyPress(message.key, message.ctrl), sender);
    case messages.OPEN_URL:
      if (message.newTab) {
        return this.store.dispatch(
          tabActions.openNewTab(message.url), sender);
      }
      return this.store.dispatch(
        tabActions.openToTab(message.url, sender.tab), sender);
    case messages.CONSOLE_BLURRED:
      return this.store.dispatch(
        consoleActions.hide(), sender);
    case messages.CONSOLE_ENTERED:
      return this.store.dispatch(
        commandActions.exec(message.text, this.settings), sender);
    case messages.CONSOLE_CHANGEED:
      return this.store.dispatch(
        commandActions.complete(message.text, this.settings), sender);
    case messages.SETTINGS_RELOAD:
      this.store.dispatch(settingsActions.load());
    }
  }
}
