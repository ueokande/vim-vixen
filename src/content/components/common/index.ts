import InputComponent from './input';
import FollowComponent from './follow';
import MarkComponent from './mark';
import KeymapperComponent from './keymapper';
import * as settingActions from '../../actions/setting';
import * as messages from '../../../shared/messages';
import MessageListener from '../../MessageListener';
import * as addonActions from '../../actions/addon';
import * as blacklists from '../../../shared/blacklists';
import * as keys from '../../../shared/utils/keys';

export default class Common {
  private win: Window;

  private store: any;

  constructor(win: Window, store: any) {
    const input = new InputComponent(win.document.body);
    const follow = new FollowComponent(win);
    const mark = new MarkComponent(win.document.body, store);
    const keymapper = new KeymapperComponent(store);

    input.onKey((key: keys.Key) => follow.key(key));
    input.onKey((key: keys.Key) => mark.key(key));
    input.onKey((key: keys.Key) => keymapper.key(key));

    this.win = win;
    this.store = store;

    this.reloadSettings();

    new MessageListener().onBackgroundMessage(this.onMessage.bind(this));
  }

  onMessage(message: messages.Message) {
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
      this.store.dispatch(settingActions.load())
        .then(({ value: settings }: any) => {
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
