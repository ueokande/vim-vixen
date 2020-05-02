import * as dom from "../shared/utils/dom";
import Key from "../shared/settings/Key";

const cancelKey = (e: KeyboardEvent): boolean => {
  if (e.key === "Escape") {
    return true;
  }
  if (e.key === "[" && e.ctrlKey) {
    return true;
  }
  return false;
};

const modifiedKeyName = (name: string): string => {
  if (name === " ") {
    return "Space";
  }
  if (name.length === 1) {
    return name;
  } else if (name === "Escape") {
    return "Esc";
  }
  return name;
};

// visible for testing
export const keyFromKeyboardEvent = (e: KeyboardEvent): Key => {
  const key = modifiedKeyName(e.key);
  let shift = e.shiftKey;
  if (key.length === 1 && key.toUpperCase() === key.toLowerCase()) {
    // make shift false for symbols to enable key bindings by symbold keys.
    // But this limits key bindings by symbol keys with Shift
    // (such as Shift+$>.
    shift = false;
  }

  return new Key({
    key: modifiedKeyName(e.key),
    shift: shift,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    meta: e.metaKey,
  });
};

export default class InputDriver {
  private pressed: { [key: string]: string } = {};

  private onKeyListeners: ((key: Key) => boolean)[] = [];

  constructor(target: HTMLElement) {
    this.pressed = {};
    this.onKeyListeners = [];

    target.addEventListener("keypress", this.onKeyPress.bind(this));
    target.addEventListener("keydown", this.onKeyDown.bind(this));
    target.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKey(cb: (key: Key) => boolean) {
    this.onKeyListeners.push(cb);
  }

  private onKeyPress(e: KeyboardEvent) {
    if (this.pressed[e.key] && this.pressed[e.key] !== "keypress") {
      return;
    }
    this.pressed[e.key] = "keypress";
    this.capture(e);
  }

  private onKeyDown(e: KeyboardEvent) {
    if (this.pressed[e.key] && this.pressed[e.key] !== "keydown") {
      return;
    }
    this.pressed[e.key] = "keydown";
    this.capture(e);
  }

  private onKeyUp(e: KeyboardEvent) {
    delete this.pressed[e.key];
  }

  // eslint-disable-next-line max-statements
  private capture(e: KeyboardEvent) {
    const target = e.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (this.fromInput(target)) {
      if (cancelKey(e) && target.blur) {
        target.blur();
      }
      return;
    }
    if (["Shift", "Control", "Alt", "OS"].includes(e.key)) {
      // pressing only meta key is ignored
      return;
    }

    const key = keyFromKeyboardEvent(e);
    for (const listener of this.onKeyListeners) {
      const stop = listener(key);
      if (stop) {
        e.preventDefault();
        e.stopPropagation();
        break;
      }
    }
  }

  private fromInput(e: Element) {
    return (
      e instanceof HTMLInputElement ||
      e instanceof HTMLTextAreaElement ||
      e instanceof HTMLSelectElement ||
      dom.isContentEditable(e)
    );
  }
}
