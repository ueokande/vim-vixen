import './console-frame.scss';

export default class ConsoleFrame {
  constructor(win, initial = '') {
    let url = browser.runtime.getURL('build/console.html') +
      '#' + encodeURIComponent(initial);

    let element = window.document.createElement('iframe');
    element.src = url;
    element.className = 'vimvixen-console-frame';
    win.document.body.append(element);

    this.element = element;
  }

  remove() {
    this.element.remove();
  }
}
