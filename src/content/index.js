import * as scrolls from './scrolls';
import * as actions from '../shared/actions';

const invokeEvent = (action) => {
  if (typeof action === 'undefined' || action === null) {
    return;
  }

  switch (action[0]) {
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
