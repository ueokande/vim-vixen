import messages from '../content/messages';

export default class ContentInputComponent {
  constructor(target) {
    this.pressed = {};

    target.addEventListener('keypress', this.onKeyPress.bind(this));
    target.addEventListener('keydown', this.onKeyDown.bind(this));
    target.addEventListener('keyup', this.onKeyUp.bind(this));
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
    if (e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement) {
      if (e.key === 'Escape' && e.target.blur) {
        e.target.blur();
      }
      return;
    }
    browser.runtime.sendMessage({
      type: messages.KEYDOWN,
      key: e.key,
      ctrl: e.ctrlKey
    });
  }
}
