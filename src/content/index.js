import * as scrolls from './scrolls';

const invokeEvent = (action) => {
  if (typeof action === 'undefined' || action === null) {
    return;
  }

  switch (action[0]) {
  case 'scroll.up':
    scrolls.scrollUp(window, action[1] || 1);
    break;
  case 'scroll.down':
    scrolls.scrollDown(window, action[1] || 1);
    break;
  }
}

window.addEventListener("keydown", (e) => {
  let request = {
    type: 'event.keydown',
    code: e.keyCode,
    shift: e.shift,
    alt: e.alt,
    meta: e.meta,
    ctrl: e.ctrl,
  }

  browser.runtime.sendMessage(request)
    .then(invokeEvent,
      (err) => {
        console.log(`Vim Vixen: ${err}`);
      });
});
