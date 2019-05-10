import InputComponent from './input';
import FollowComponent from './follow';
import MarkComponent from './mark';
import KeymapperComponent from './keymapper';
import * as messages from '../../../shared/messages';
import MessageListener from '../../MessageListener';
import * as blacklists from '../../../shared/blacklists';
import * as keys from '../../../shared/utils/keys';

import AddonEnabledUseCase from '../../usecases/AddonEnabledUseCase';
import SettingUseCase from '../../usecases/SettingUseCase';

let addonEnabledUseCase = new AddonEnabledUseCase();
let settingUseCase = new SettingUseCase();

export default class Common {
  constructor(win: Window, store: any) {
    const input = new InputComponent(win.document.body);
    const follow = new FollowComponent(win);
    const mark = new MarkComponent(store);
    const keymapper = new KeymapperComponent(store);

    input.onKey((key: keys.Key) => follow.key(key));
    input.onKey((key: keys.Key) => mark.key(key));
    input.onKey((key: keys.Key) => keymapper.key(key));

    this.reloadSettings();

    new MessageListener().onBackgroundMessage(this.onMessage.bind(this));
  }

  onMessage(message: messages.Message) {
    switch (message.type) {
    case messages.SETTINGS_CHANGED:
      return this.reloadSettings();
    case messages.ADDON_TOGGLE_ENABLED:
      return addonEnabledUseCase.toggle();
    }
    return undefined;
  }

  async reloadSettings() {
    try {
      let current = await settingUseCase.reload();
      let disabled = blacklists.includes(
        current.blacklist, window.location.href,
      );
      if (disabled) {
        addonEnabledUseCase.disable();
      } else {
        addonEnabledUseCase.enable();
      }
    } catch (e) {
      // Sometime sendMessage fails when background script is not ready.
      console.warn(e);
      setTimeout(() => this.reloadSettings(), 500);
    }
  }
}
