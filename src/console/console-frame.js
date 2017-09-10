import './console-frame.scss';
import * as consoleActions from '../actions/console';

export default class ConsoleFrame {
  constructor(win) {
    let element = window.document.createElement('iframe');
    element.src = browser.runtime.getURL('build/console.html');
    element.className = 'vimvixen-console-frame';
    win.document.body.append(element);

    this.element = element;

    this.errorShown = true;

    this.hide();
  }

  showCommand(text) {
    this.showFrame();
    this.errorShown = false;
    return browser.runtime.sendMessage(consoleActions.showCommand(text));
  }

  showError(text) {
    this.showFrame();

    this.errorShown = true;
    this.element.blur();

    return browser.runtime.sendMessage(consoleActions.showError(text));
  }

  showFrame() {
    this.element.style.display = 'block';
  }

  hide() {
    this.element.style.display = 'none';
    this.element.blur();
    this.errorShown = false;

    return browser.runtime.sendMessage(consoleActions.hide());
  }

  isErrorShown() {
    return this.element.style.display === 'block' && this.errorShown;
  }
}
