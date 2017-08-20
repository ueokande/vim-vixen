import * as scrolls from './scrolls';
import FooterLine from './footer-line';
import Follow from './follow';
import * as actions from '../shared/actions';

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
  case actions.SCROLL_UP:
    scrolls.scrollUp(window, action[1] || 1);
    break;
  case actions.SCROLL_DOWN:
    scrolls.scrollDown(window, action[1] || 1);
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
  }
}

const isModifier = (code) => {
  return code === KeyboardEvent.DOM_VK_SHIFT ||
    code === KeyboardEvent.DOM_VK_ALT ||
    code === KeyboardEvent.DOM_VK_CONTROL ||
    code === KeyboardEvent.DOM_VK_META;
}

window.addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLInputElement) {
    return;
  }
  if (isModifier(e.keyCode)) {
    return;
  }

  let request = {
    type: 'event.keydown',
    code: e.keyCode,
    shift: e.shiftKey,
    alt: e.altKey,
    meta: e.metaKey,
    ctrl: e.ctrlKey,
  }

  browser.runtime.sendMessage(request)
    .then(invokeEvent,
      (err) => {
        console.log(`Vim Vixen: ${err}`);
      });
});
