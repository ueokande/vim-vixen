import '../console/console-frame.scss';
import * as consoleFrames from '../console/frames';
import * as scrolls from '../content/scrolls';
import * as navigates from '../content/navigates';
import Follow from '../content/follow';
import operations from '../operations';
import messages from '../messages';

consoleFrames.initialize(window.document);

const startFollows = (newTab) => {
  let follow = new Follow(window.document);
  follow.onActivated((element) => {
    switch (element.tagName.toLowerCase()) {
    case 'a':
      if (newTab) {
        // getAttribute() to avoid to resolve absolute path
        let href = element.getAttribute('href');

        // eslint-disable-next-line no-script-url
        if (!href || href === '#' || href.startsWith('javascript:')) {
          return;
        }
        return browser.runtime.sendMessage({
          type: messages.OPEN_URL,
          url: element.href,
          newTab
        });
      }
      if (element.href.startsWith('http://') ||
        element.href.startsWith('https://') ||
        element.href.startsWith('ftp://')) {
        return browser.runtime.sendMessage({
          type: messages.OPEN_URL,
          url: element.href,
          newTab
        });
      }
      return element.click();
    case 'input':
      switch (element.type) {
      case 'file':
      case 'checkbox':
      case 'radio':
      case 'submit':
      case 'reset':
      case 'button':
      case 'image':
      case 'color':
        return element.click();
      default:
        return element.focus();
      }
    case 'textarea':
      return element.focus();
    case 'button':
      return element.click();
    }
  });
};

window.addEventListener('keypress', (e) => {
  if (e.target instanceof HTMLInputElement ||
    e.target instanceof HTMLTextAreaElement ||
    e.target instanceof HTMLSelectElement) {
    return;
  }
  browser.runtime.sendMessage({
    type: messages.KEYDOWN,
    code: e.which,
    ctrl: e.ctrlKey
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
    return startFollows(operation.newTab);
  case operations.NAVIGATE_HISTORY_PREV:
    return navigates.historyPrev(window);
  case operations.NAVIGATE_HISTORY_NEXT:
    return navigates.historyNext(window);
  case operations.NAVIGATE_LINK_PREV:
    return navigates.linkPrev(window);
  case operations.NAVIGATE_LINK_NEXT:
    return navigates.linkNext(window);
  case operations.NAVIGATE_PARENT:
    return navigates.parent(window);
  case operations.NAVIGATE_ROOT:
    return navigates.root(window);
  }
};

const update = (state) => {
  if (!state.console.commandShown) {
    window.focus();
    consoleFrames.blur(window.document);
  }
};

browser.runtime.onMessage.addListener((action) => {
  switch (action.type) {
  case messages.STATE_UPDATE:
    return update(action.state);
  case messages.CONTENT_OPERATION:
    execOperation(action.operation);
    return Promise.resolve();
  default:
    return Promise.resolve();
  }
});
