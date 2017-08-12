import * as scrolls from './scrolls';

const invokeEvent = (type) => {
  switch (type) {
  case 'scroll.up':
    scrolls.scrollUp(window);
    break;
  case 'scroll.down':
    scrolls.scrollDown(window);
    break;
  }
}

window.addEventListener("keypress", (e) => {
  browser.runtime.sendMessage({
    key: e.which || e.keyCode,
    shift: e.shift,
    alt: e.alt,
    meta: e.meta,
    ctrl: e.ctrl,
  }).then((response) => {
    if (response) {
      invokeEvent(response);
    }
  }, (err) => {
    console.log(`Vim Vixen: ${err}`);
  });
});
