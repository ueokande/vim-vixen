import * as inputActions from 'actions/input';
import * as operationActions from 'actions/operation';

export default class BackgroundInputComponent {
  constructor(store) {
    this.store = store;
    this.keymaps = {};
    this.prevInputs = [];
  }

  update(sender) {
    let state = this.store.getState();
    this.reloadSettings(state.setting);
    this.handleKeyInputs(sender, state.input);
  }

  reloadSettings(setting) {
    if (!setting.settings.json) {
      return;
    }
    this.keymaps = JSON.parse(setting.settings.json).keymaps;
  }

  handleKeyInputs(sender, input) {
    if (JSON.stringify(this.prevInputs) === JSON.stringify(input)) {
      return;
    }
    this.prevInputs = input;

    if (input.keys.length === 0) {
      return;
    }
    if (sender) {
      return this.handleKeysChanged(sender, input);
    }
  }

  handleKeysChanged(sender, input) {
    let matched = Object.keys(this.keymaps).filter((keyStr) => {
      return keyStr.startsWith(input.keys);
    });
    if (matched.length === 0) {
      this.store.dispatch(inputActions.clearKeys(), sender);
      return Promise.resolve();
    } else if (matched.length > 1 ||
      matched.length === 1 && input.keys !== matched[0]) {
      return Promise.resolve();
    }
    let operation = this.keymaps[matched];
    this.store.dispatch(operationActions.exec(operation, sender.tab), sender);
    this.store.dispatch(inputActions.clearKeys(), sender);
  }
}
