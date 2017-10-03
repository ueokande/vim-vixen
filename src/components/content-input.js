import messages from '../content/messages';

export default class ContentInputComponent {
  constructor(target) {
    target.addEventListener('keypress', this.onKeyPress.bind(this));
    target.addEventListener('keydown', this.onKeyDown.bind(this));
    target.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  onKeyPress(e) {
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

  onKeyDown() {
  }

  onKeyUp() {
  }
}
