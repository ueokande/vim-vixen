import * as scrolls from './scrolls';
import * as histories from './histories';
import * as actions from '../shared/actions';
import FooterLine from './footer-line';
import Follow from './follow';

var footer = null;

const createFooterLine = (initial = '') => {
  footer = new FooterLine(document, initial);
  footer.onPromptChange((e) => {
    let request = {
      type: 'event.cmd.suggest',
      text: e.target.value
    };
    browser.runtime.sendMessage(request);
  });
  footer.onEntered((e) => {
    let request = {
      type: 'event.cmd.enter',
      text: e.target.value
    };
    browser.runtime.sendMessage(request);
  });
  footer.focus();
}

const invokeEvent = (action) => {
  if (typeof action === 'undefined' || action === null) {
    return;
  }

  switch (action[0]) {
  case actions.CMD_OPEN:
    createFooterLine();
    break;
  case actions.CMD_TABS_OPEN:
    if (action[1] || false) {
      // alter url
      createFooterLine('open ' + window.location.href);
    } else {
      createFooterLine('open ');
    }
    break;
  case actions.SCROLL_LINES:
    scrolls.scrollLines(window, action[1]);
    break;
  case actions.SCROLL_PAGES:
    scrolls.scrollPages(window, action[1]);
    break;
  case actions.SCROLL_TOP:
    scrolls.scrollTop(window, action[1]);
    break;
  case actions.SCROLL_BOTTOM:
    scrolls.scrollBottom(window, action[1]);
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
