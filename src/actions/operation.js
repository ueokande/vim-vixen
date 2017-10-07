import operations from 'shared/operations';
import messages from 'content/messages';
import * as tabs from 'background/tabs';
import * as zooms from 'background/zooms';
import * as scrolls from 'content/scrolls';
import * as navigates from 'content/navigates';
import * as followActions from 'actions/follow';

const sendConsoleShowCommand = (tab, command) => {
  return browser.tabs.sendMessage(tab.id, {
    type: messages.CONSOLE_SHOW_COMMAND,
    command,
  });
};

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

const execBackground = (operation, tab) => {
  switch (operation.type) {
  case operations.TAB_CLOSE:
    return tabs.closeTab(tab.id);
  case operations.TAB_REOPEN:
    return tabs.reopenTab();
  case operations.TAB_PREV:
    return tabs.selectPrevTab(tab.index, operation.count);
  case operations.TAB_NEXT:
    return tabs.selectNextTab(tab.index, operation.count);
  case operations.TAB_RELOAD:
    return tabs.reload(tab, operation.cache);
  case operations.ZOOM_IN:
    return zooms.zoomIn();
  case operations.ZOOM_OUT:
    return zooms.zoomOut();
  case operations.ZOOM_NEUTRAL:
    return zooms.neutral();
  case operations.COMMAND_SHOW:
    return sendConsoleShowCommand(tab, '');
  case operations.COMMAND_SHOW_OPEN:
    if (operation.alter) {
      // alter url
      return sendConsoleShowCommand(tab, 'open ' + tab.url);
    }
    return sendConsoleShowCommand(tab, 'open ');
  case operations.COMMAND_SHOW_TABOPEN:
    if (operation.alter) {
      // alter url
      return sendConsoleShowCommand(tab, 'tabopen ' + tab.url);
    }
    return sendConsoleShowCommand(tab, 'tabopen ');
  case operations.COMMAND_SHOW_BUFFER:
    return sendConsoleShowCommand(tab, 'buffer ');
  default:
    return Promise.resolve();
  }
};

export { exec, execBackground };
