import * as dom from '../shared/utils/dom';
import Key, * as keys from './domains/Key';

const cancelKey = (e: KeyboardEvent): boolean => {
  return e.key === 'Escape' || e.key === '[' && e.ctrlKey;
};

export default class InputDriver {
  private pressed: {[key: string]: string} = {};

  private onKeyListeners: ((key: Key) => boolean)[] = [];

  constructor(target: HTMLElement) {
    this.pressed = {};
    this.onKeyListeners = [];

    target.addEventListener('keypress', this.onKeyPress.bind(this));
    target.addEventListener('keydown', this.onKeyDown.bind(this));
    target.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  onKey(cb: (key: Key) => boolean) {
    this.onKeyListeners.push(cb);
  }

  private onKeyPress(e: KeyboardEvent) {
    if (this.pressed[e.key] && this.pressed[e.key] !== 'keypress') {
      return;
    }
    this.pressed[e.key] = 'keypress';
    this.capture(e);
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.pressed[e.key] && this.pressed[e.key] !== 'keydown') {
      return;
    }
    this.pressed[e.key] = 'keydown';
    this.capture(e);
  }

  private onKeyUp(e: KeyboardEvent) {
    delete this.pressed[e.key];
  }

  // eslint-disable-next-line max-statements
  private capture(e: KeyboardEvent) {
    let target = e.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (this.fromInput(target)) {
      if (cancelKey(e) && target.blur) {
        target.blur();
      }
      return;
    }
    if (['Shift', 'Control', 'Alt', 'OS'].includes(e.key)) {
      // pressing only meta key is ignored
      return;
    }

    let key = keys.fromKeyboardEvent(e);
    for (let listener of this.onKeyListeners) {
      let stop = listener(key);
      if (stop) {
        e.preventDefault();
        e.stopPropagation();
        break;
      }
    }
  }

  private fromInput(e: Element) {
    return e instanceof HTMLInputElement ||
      e instanceof HTMLTextAreaElement ||
      e instanceof HTMLSelectElement ||
      dom.isContentEditable(e);
  }
}
