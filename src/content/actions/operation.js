import operations from 'shared/operations';
import messages from 'shared/messages';
import * as scrolls from 'content/scrolls';
import * as navigates from 'content/navigates';
import * as urls from 'content/urls';
import * as followActions from 'content/actions/follow';
import * as consoleFrames from 'content/console-frames';

const exec = (operation) => {
  switch (operation.type) {
  case operations.SCROLL_VERTICALLY:
    return scrolls.scrollVertically(window, operation.count);
  case operations.SCROLL_HORIZONALLY:
    return scrolls.scrollHorizonally(window, operation.count);
  case operations.SCROLL_PAGES:
    return scrolls.scrollPages(window, operation.count);
  case operations.SCROLL_TOP:
    return scrolls.scrollTop(window);
  case operations.SCROLL_BOTTOM:
    return scrolls.scrollBottom(window);
  case operations.SCROLL_HOME:
    return scrolls.scrollHome(window);
  case operations.SCROLL_END:
    return scrolls.scrollEnd(window);
  case operations.FOLLOW_START:
    return followActions.enable(operation.newTab, operation.background);
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
  case operations.URLS_YANK:
    urls.yank(window);
    return consoleFrames.postMessage(window.document, {
      type: messages.CONSOLE_SHOW_INFO,
      text: 'Current url yanked',
    });
  default:
    browser.runtime.sendMessage({
      type: messages.BACKGROUND_OPERATION,
      operation,
    });
  }
};

export { exec };
