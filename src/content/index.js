import * as scrolls from './scrolls';
import * as histories from './histories';
import * as actions from '../shared/actions';
import ConsoleFrame from '../console/console-frame';
import Follow from './follow';

let vvConsole = new ConsoleFrame(window);

browser.runtime.onMessage.addListener((action) => {
  switch (action.type) {
  case actions.CMD_OPEN:
    return vvConsole.showCommand('');
  case actions.CMD_TABS_OPEN:
    if (action.alter) {
      // alter url
      return vvConsole.showCommand('open ' + window.location.href);
    } else {
      return vvConsole.showCommand('open ');
    }
  case actions.CMD_BUFFER:
    return vvConsole.showCommand('buffer ');
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
      vvConsole.showError(err.message);
    });
});

browser.runtime.onMessage.addListener((action) => {
  switch (action.type) {
  case 'vimvixen.command.blur':
    if (!vvConsole.isErrorShown()) {
      vvConsole.hide();
    }
    return Promise.resolve();
  case 'vimvixen.command.enter':
    return browser.runtime.sendMessage({
      type: 'event.cmd.enter',
      text: action.value
    }).catch((err) => {
      console.error("Vim Vixen:", err);
      vvConsole.showError(err.message);
    });
  default:
    return Promise.resolve();
  }
});
