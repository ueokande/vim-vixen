import InputComponent from './input';
import FollowComponent from './follow';
import MarkComponent from './mark';
import KeymapperComponent from './keymapper';
import * as settingActions from '../../actions/setting';
import * as messages from '../../../shared/messages';
import MessageListener from '../../MessageListener';
import * as blacklists from '../../../shared/blacklists';
import * as keys from '../../../shared/utils/keys';
import * as actions from '../../actions';

import AddonEnabledUseCase from '../../usecases/AddonEnabledUseCase';

let addonEnabledUseCase = new AddonEnabledUseCase();

export default class Common {
  private win: Window;

  private store: any;

  constructor(win: Window, store: any) {
    const input = new InputComponent(win.document.body);
    const follow = new FollowComponent(win);
    const mark = new MarkComponent(store);
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
    switch (message.type) {
    case messages.SETTINGS_CHANGED:
      return this.reloadSettings();
    case messages.ADDON_TOGGLE_ENABLED:
      addonEnabledUseCase.toggle();
    }
  }

  reloadSettings() {
    try {
      this.store.dispatch(settingActions.load())
        .then((action: actions.SettingAction) => {
          let enabled = !blacklists.includes(
            action.settings.blacklist, this.win.location.href
          );
          if (enabled) {
            addonEnabledUseCase.enable();
          } else {
            addonEnabledUseCase.disable();
          }
        });
    } catch (e) {
      // Sometime sendMessage fails when background script is not ready.
      console.warn(e);
      setTimeout(() => this.reloadSettings(), 500);
    }
  }
}
