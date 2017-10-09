import * as inputActions from 'content/actions/input';
import * as operationActions from 'content/actions/operation';

export default class KeymapperComponent {
  constructor(store) {
    this.store = store;
  }

  update() {
  }

  key(key, ctrl) {
    this.store.dispatch(inputActions.keyPress(key, ctrl));

    let input = this.store.getState().input;
    let matched = Object.keys(input.keymaps).filter((keyStr) => {
      return keyStr.startsWith(input.keys);
    });
    if (matched.length === 0) {
      this.store.dispatch(inputActions.clearKeys());
      return false;
    } else if (matched.length > 1 ||
      matched.length === 1 && input.keys !== matched[0]) {
      return true;
    }
    let operation = input.keymaps[matched];
    this.store.dispatch(operationActions.exec(operation));
    this.store.dispatch(inputActions.clearKeys());
    return true;
  }
}
