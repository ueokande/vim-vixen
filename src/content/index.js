import * as scrolls from './scrolls';
import * as histories from './histories';
import * as actions from '../shared/actions';
import * as messages from '../shared/messages';
import ConsoleFrame from '../console/console-frame';
import Follow from './follow';

let cmd = null;

const invokeEvent = (action) => {
  if (typeof action === 'undefined' || action === null) {
    return;
  }

  switch (action[0]) {
  case actions.CMD_OPEN:
    cmd = new ConsoleFrame(window);
    break;
  case actions.CMD_TABS_OPEN:
    if (action[1] || false) {
      // alter url
      cmd = new ConsoleFrame(window, 'open ' + window.location.href);
    } else {
      cmd = new ConsoleFrame(window, 'open ');
    }
    break;
  case actions.SCROLL_LINES:
    scrolls.scrollLines(window, action[1]);
    break;
  case actions.SCROLL_PAGES:
    scrolls.scrollPages(window, action[1]);
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
    new Follow(window.document, action[1] || false);
    break;
  case actions.HISTORY_PREV:
    histories.prev(window);
    break;
  case actions.HISTORY_NEXT:
    histories.next(window);
    break;
  }
}

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
    .then(invokeEvent,
      (err) => {
        console.log(`Vim Vixen: ${err}`);
      });
});

messages.receive(window, (message) => {
  switch (message.type) {
  case 'vimvixen.commandline.blur':
    if (cmd) {
      cmd.remove();
      cmd = null;
    }
    break;
  case 'vimvixen.commandline.enter':
    browser.runtime.sendMessage({
      type: 'event.cmd.enter',
      text: message.value
    });
    break;
  case 'vimvixen.commandline.change':
    browser.runtime.sendMessage({
      type: 'event.cmd.suggest',
      text: message.value
    });
    break;
  default:
    return;
  }
});
