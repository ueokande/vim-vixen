import InputComponent from './input';
import KeymapperComponent from './keymapper';
import FollowComponent from './follow';
import * as settingActions from 'content/actions/setting';
import messages from 'shared/messages';

export default class Common {
  constructor(win, store) {
    const follow = new FollowComponent(win, store);
    const input = new InputComponent(win.document.body, store);
    const keymapper = new KeymapperComponent(store);

    input.onKey(key => follow.key(key));
    input.onKey(key => keymapper.key(key));

    this.store = store;
    this.prevEnabled = this.store.getState().addon.enabled;

    this.reloadSettings();

    messages.onMessage(this.onMessage.bind(this));
    store.subscribe(() => this.update());
  }

  onMessage(message) {
    switch (message.type) {
    case messages.SETTINGS_CHANGED:
      this.reloadSettings();
    }
  }

  update() {
    let enabled = this.store.getState().addon.enabled;
    if (enabled !== this.prevEnabled) {
      this.prevEnabled = enabled;

      browser.runtime.sendMessage({
        type: messages.ADDON_ENABLED_RESPONSE,
        enabled,
      });
    }
  }

  reloadSettings() {
    browser.runtime.sendMessage({
      type: messages.SETTINGS_QUERY,
    }).then((settings) => {
      this.store.dispatch(settingActions.set(settings));
    }).catch((e) => {
      // Sometime sendMessage fails when background script is not ready.
      console.warn(e);
      setTimeout(() => this.reloadSettings(), 500);
    });
  }
}
