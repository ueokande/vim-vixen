const modifierdKeyName = (name) => {
  if (name.length === 1) {
    return name.toUpperCase();
  } else if (name === 'Escape') {
    return 'Esc';
  }
  return name;
};

const mapKey = (e) => {
  if (e.ctrlKey) {
    return '<C-' + modifierdKeyName(e.key) + '>';
  } else if (e.shiftKey && e.key.length !== 1) {
    return '<S-' + modifierdKeyName(e.key) + '>';
  }
  return e.key;
};

export default class InputComponent {
  constructor(target) {
    this.pressed = {};
    this.onKeyListeners = [];

    target.addEventListener('keypress', this.onKeyPress.bind(this));
    target.addEventListener('keydown', this.onKeyDown.bind(this));
    target.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  update() {
  }

  onKey(cb) {
    this.onKeyListeners.push(cb);
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
    if (['Shift', 'Control', 'Alt', 'OS'].includes(e.key)) {
      // pressing only meta key is ignored
      return;
    }

    let key = mapKey(e);

    for (let listener of this.onKeyListeners) {
      let stop = listener(key);
      if (stop) {
        e.preventDefault();
        e.stopPropagation();
        break;
      }
    }
  }

  fromInput(e) {
    return e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement ||
      e.target instanceof HTMLElement &&
      e.target.hasAttribute('contenteditable') && (
          e.target.getAttribute('contenteditable').toLowerCase() === 'true' ||
          e.target.getAttribute('contenteditable').toLowerCase() === '');
  }
}
