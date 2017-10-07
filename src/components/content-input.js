import * as inputActions from 'actions/input';
import * as operationActions from 'actions/operation';

export default class ContentInputComponent {
  constructor(target, store) {
    this.pressed = {};
    this.store = store;

    target.addEventListener('keypress', this.onKeyPress.bind(this));
    target.addEventListener('keydown', this.onKeyDown.bind(this));
    target.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  update() {
  }

  onKeyPress(e) {
    if (this.pressed[e.key] && this.pressed[e.key] !== 'keypress') {
      return;
    }
    this.pressed[e.key] = 'keypress';
    this.capture(e);
  }

  onKeyDown(e) {
    if (this.pressed[e.key] && this.pressed[e.key] !== 'keydown') {
      return;
    }
    this.pressed[e.key] = 'keydown';
    this.capture(e);
  }

  onKeyUp(e) {
    delete this.pressed[e.key];
  }

  capture(e) {
    if (this.fromInput(e)) {
      if (e.key === 'Escape' && e.target.blur) {
        e.target.blur();
      }
      return;
    }
    if (e.key === 'OS') {
      return;
    }
    let keymaps = this.keymaps();
    if (!keymaps) {
      return;
    }
    this.store.dispatch(inputActions.keyPress(e.key, e.ctrlKey));

    if (this.mapKeys(keymaps)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  mapKeys(keymaps) {
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

  fromInput(e) {
    return e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement;
  }

  keymaps() {
    let settings = this.store.getState().setting.settings;
    if (!settings || !settings.json) {
      return null;
    }
    return JSON.parse(settings.json).keymaps;
  }
}
