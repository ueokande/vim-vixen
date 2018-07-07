import InputComponent from './input';
import KeymapperComponent from './keymapper';
import FollowComponent from './follow';
import * as settingActions from 'content/actions/setting';
import messages from 'shared/messages';
import * as addonActions from '../../actions/addon';
import * as blacklists from 'shared/blacklists';

export default class Common {
  constructor(win, store) {
    const follow = new FollowComponent(win, store);
    const input = new InputComponent(win.document.body, store);
    const keymapper = new KeymapperComponent(store);

    input.onKey(key => follow.key(key));
    input.onKey(key => keymapper.key(key));

    this.win = win;
    this.store = store;
    this.prevEnabled = undefined;
    this.prevBlacklist = undefined;

    this.reloadSettings();

    messages.onMessage(this.onMessage.bind(this));
  }

  onMessage(message) {
    let { enabled } = this.store.getState().addon;
    switch (message.type) {
    case messages.SETTINGS_CHANGED:
      return this.reloadSettings();
    case messages.ADDON_TOGGLE_ENABLED:
      this.store.dispatch(addonActions.setEnabled(!enabled));
    }
  }

  reloadSettings() {
    try {
      this.store.dispatch(settingActions.load()).then(({ value: settings }) => {
        let enabled = !blacklists.includes(
          settings.blacklist, this.win.location.href
        );
        this.store.dispatch(addonActions.setEnabled(enabled));
      });
    } catch (e) {
      // Sometime sendMessage fails when background script is not ready.
      console.warn(e);
      setTimeout(() => this.reloadSettings(), 500);
    }
  }
}
