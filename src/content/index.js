import '../console/console-frame.scss';
import * as inputActions from '../actions/input';
import * as consoleFrames from '../console/frames';
import actions from '../actions';
import contentReducer from '../reducers/content';

consoleFrames.initialize(window.document);

browser.runtime.onMessage.addListener((action) => {
  contentReducer(undefined, action);
  return Promise.resolve();
});

window.addEventListener("keypress", (e) => {
  if (e.target instanceof HTMLInputElement) {
    return;
  }
  browser.runtime.sendMessage(inputActions.keyPress(e.which, e.ctrlKey))
    .catch((err) => {
      console.error("Vim Vixen:", err);
      return consoleFrames.showError(err.message);
    });
});

browser.runtime.onMessage.addListener((action) => {
  switch (action.type) {
  case actions.CONSOLE_HIDE:
    window.focus();
    return consoleFrames.blur(window.document);
  case 'vimvixen.command.enter':
    return browser.runtime.sendMessage({
      type: 'event.cmd.enter',
      text: action.value
    }).catch((err) => {
      console.error("Vim Vixen:", err);
      return consoleFrames.showError(err.message);
    });
  default:
    return Promise.resolve();
  }
});
