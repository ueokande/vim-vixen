import messages from '../content/messages';

export default class ContentInputComponent {
  constructor(target) {
    this.pressed = {};

    target.addEventListener('keypress', this.onKeyPress.bind(this));
    target.addEventListener('keydown', this.onKeyDown.bind(this));
    target.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  onKeyPress(e) {
    this.capture(e);
  }

  onKeyDown(e) {
    this.capture(e);
  }

  onKeyUp(e) {
    this.pressed[e.key] = false;
  }

  capture(e) {
    if (this.pressed[e.key]) {
      return;
    }
    this.pressed[e.key] = true;

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
