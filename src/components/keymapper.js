import * as inputActions from 'actions/input';
import * as operationActions from 'actions/operation';

export default class KeymapperComponent {
  constructor(store) {
    this.store = store;
  }

  update() {
  }

  key(key, ctrl) {
    let keymaps = this.keymaps();
    if (!keymaps) {
      return;
    }
    this.store.dispatch(inputActions.keyPress(key, ctrl));

    let input = this.store.getState().input;
    let matched = Object.keys(keymaps).filter((keyStr) => {
      return keyStr.startsWith(input.keys);
    });
    if (matched.length === 0) {
      this.store.dispatch(inputActions.clearKeys());
      return false;
    } else if (matched.length > 1 ||
      matched.length === 1 && input.keys !== matched[0]) {
      return true;
    }
    let operation = keymaps[matched];
    this.store.dispatch(operationActions.exec(operation));
    this.store.dispatch(inputActions.clearKeys());
    return true;
  }

  keymaps() {
    let settings = this.store.getState().setting.settings;
    if (!settings || !settings.json) {
      return null;
    }
    return JSON.parse(settings.json).keymaps;
  }
}
