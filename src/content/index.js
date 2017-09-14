import '../console/console-frame.scss';
import * as inputActions from '../actions/input';
import * as consoleFrames from '../console/frames';
import * as scrolls from '../content/scrolls';
import * as histories from '../content/histories';
import Follow from '../content/follow';
import operations from '../operations';

consoleFrames.initialize(window.document);

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

const execOperation = (operation) => {
  switch (operation.type) {
  case operations.SCROLL_LINES:
    return scrolls.scrollLines(window, operation.count);
  case operations.SCROLL_PAGES:
    return scrolls.scrollPages(window, operation.count);
  case operations.SCROLL_TOP:
    return scrolls.scrollTop(window);
  case operations.SCROLL_BOTTOM:
    return scrolls.scrollBottom(window);
  case operations.SCROLL_LEFT:
    return scrolls.scrollLeft(window);
  case operations.SCROLL_RIGHT:
    return scrolls.scrollRight(window);
  case operations.FOLLOW_START:
    return new Follow(window.document, operation.newTab);
  case operations.HISTORY_PREV:
    return histories.prev(window);
  case operations.HISTORY_NEXT:
    return histories.next(window);
  }
}

const update = (state) => {
  if (!state.console.commandShown) {
    window.focus();
    consoleFrames.blur(window.document);
  }
}

browser.runtime.onMessage.addListener((action) => {
  switch (action.type) {
  case 'state.changed':
    return update(action.state);
  case 'require.content.operation':
    execOperation(action.operation);
    return Promise.resolve();
  default:
    return Promise.resolve();
  }
});
