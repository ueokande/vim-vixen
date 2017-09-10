import './console-frame.scss';
import * as consoleActions from '../actions/console';

const initialize = (doc) => {
  let iframe = doc.createElement('iframe');
  iframe.src = browser.runtime.getURL('build/console.html');
  iframe.id = 'vimvixen-console-frame';
  iframe.className = 'vimvixen-console-frame';
  doc.body.append(iframe);

  return iframe;
}

const showCommand = (text) => {
  return browser.runtime.sendMessage(consoleActions.showCommand(text));
};

const showError = (text) => {
  return browser.runtime.sendMessage(consoleActions.showError(text));
}

const blur = (doc) => {
  let iframe = doc.getElementById('vimvixen-console-frame');
  iframe.blur();
}

export { initialize, showCommand, showError, blur };
