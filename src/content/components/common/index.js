import InputComponent from './input';
import KeymapperComponent from './keymapper';
import FollowComponent from './follow';
import * as inputActions from 'content/actions/input';
import messages from 'shared/messages';

export default class Common {
  constructor(win, store) {
    const follow = new FollowComponent(win, store);
    const input = new InputComponent(win.document.body, store);
    const keymapper = new KeymapperComponent(store);

    input.onKey((key, ctrl) => {
      follow.key(key, ctrl);
      keymapper.key(key, ctrl);
    });

    this.store = store;
    this.children = [
      follow,
      input,
      keymapper,
    ];

    this.reloadSettings();
  }

  update() {
    this.children.forEach(c => c.update());
  }

  onMessage(message) {
    switch (message) {
    case messages.SETTINGS_CHANGED:
      this.reloadSettings();
    }
  }

  reloadSettings() {
    browser.runtime.sendMessage({
      type: messages.SETTINGS_QUERY,
    }).then((settings) => {
      this.store.dispatch(inputActions.setKeymaps(settings.keymaps));
    });
  }
}
