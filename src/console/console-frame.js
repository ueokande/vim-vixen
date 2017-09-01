import './console-frame.scss';
import * as messages from '../shared/messages';

export default class ConsoleFrame {
  constructor(win, initial = '') {
    let element = window.document.createElement('iframe');
    element.src = browser.runtime.getURL('build/console.html');
    element.className = 'vimvixen-console-frame';
    win.document.body.append(element);

    this.element = element;

    this.hide();
  }

  showCommand(text) {
    this.showFrame();

    let message = {
      type: 'vimvixen.console.show.command',
      text: text
    };
    messages.send(this.element.contentWindow, message);
  }

  showError(text) {
    this.showFrame();

    let message = {
      type: 'vimvixen.console.show.error',
      text: text
    };
    messages.send(this.element.contentWindow, message);
  }

  showFrame() {
    this.element.style.display = 'block';
  }

  hide() {
    this.element.style.display = 'none';
    this.element.blur();
  }
}
