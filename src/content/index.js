import '../console/console-frame.scss';
import * as scrolls from './scrolls';
import * as histories from './histories';
import * as actions from '../shared/actions';
import * as consoleFrames from '../console/frames';
import actionTypes from '../actions';
import Follow from './follow';

consoleFrames.initialize(window.document);

browser.runtime.onMessage.addListener((action) => {
  switch (action.type) {
  case actions.CMD_OPEN:
    return consoleFrames.showCommand('');
  case actions.CMD_TABS_OPEN:
    if (action.alter) {
      // alter url
      return consoleFrames.showCommand('open ' + window.location.href);
    } else {
      return consoleFrames.showCommand('open ');
    }
  case actions.CMD_BUFFER:
    return consoleFrames.showCommand('buffer ');
  case actions.SCROLL_LINES:
    scrolls.scrollLines(window, action.count);
    break;
  case actions.SCROLL_PAGES:
    scrolls.scrollPages(window, action.count);
    break;
  case actions.SCROLL_TOP:
    scrolls.scrollTop(window);
    break;
  case actions.SCROLL_BOTTOM:
    scrolls.scrollBottom(window);
    break;
  case actions.SCROLL_LEFT:
    scrolls.scrollLeft(window);
    break;
  case actions.SCROLL_RIGHT:
    scrolls.scrollRight(window);
    break;
  case actions.FOLLOW_START:
    new Follow(window.document, action.newTab);
    break;
  case actions.HISTORY_PREV:
    histories.prev(window);
    break;
  case actions.HISTORY_NEXT:
    histories.next(window);
    break;
  }
  return Promise.resolve();
});

window.addEventListener("keypress", (e) => {
  if (e.target instanceof HTMLInputElement) {
    return;
  }

  let request = {
    type: 'event.keypress',
    code: e.which,
    ctrl: e.ctrlKey,
  }

  browser.runtime.sendMessage(request)
    .catch((err) => {
      console.error("Vim Vixen:", err);
      return consoleFrames.showError(err.message);
    });
});

browser.runtime.onMessage.addListener((action) => {
  switch (action.type) {
  case actionTypes.CONSOLE_HIDE:
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
