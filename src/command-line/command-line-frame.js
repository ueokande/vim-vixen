import './command-line-frame.scss';

export default class CommandLineFrame {
  constructor(win, initial = '') {
    let url = browser.runtime.getURL('build/command-line.html') +
      '#' + encodeURIComponent(initial);

    let element = window.document.createElement('iframe');
    element.src = url;
    element.className = 'vimvixen-command-line-frame';
    win.document.body.append(element);

    this.element = element;
  }

  remove() {
    this.element.remove();
  }
}
