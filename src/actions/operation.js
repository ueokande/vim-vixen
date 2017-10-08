import operations from 'shared/operations';
import messages from 'shared/messages';
import * as scrolls from 'content/scrolls';
import * as navigates from 'content/navigates';
import * as followActions from 'actions/follow';

const exec = (operation) => {
  switch (operation.type) {
  case operations.SCROLL_LINES:
    return scrolls.scrollLines(window, operation.count);
  case operations.SCROLL_PAGES:
    return scrolls.scrollPages(window, operation.count);
  case operations.SCROLL_TOP:
    return scrolls.scrollTop(window);
  case operations.SCROLL_BOTTOM:
    return scrolls.scrollBottom(window);
  case operations.SCROLL_HOME:
    return scrolls.scrollLeft(window);
  case operations.SCROLL_END:
    return scrolls.scrollRight(window);
  case operations.FOLLOW_START:
    return followActions.enable(false);
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
  default:
    browser.runtime.sendMessage({
      type: messages.BACKGROUND_OPERATION,
      operation,
    });
  }
};

export { exec };
