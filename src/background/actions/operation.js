import operations from 'shared/operations';
import messages from 'shared/messages';
import * as tabs from 'background/tabs';
import * as zooms from 'background/zooms';

const sendConsoleShowCommand = (tab, command) => {
  return browser.tabs.sendMessage(tab.id, {
    type: messages.CONSOLE_SHOW_COMMAND,
    command,
  });
};

// This switch statement is only gonna get longer as more
// features are added, so disable complexity check
/* eslint-disable complexity */
const exec = (operation, tab) => {
  switch (operation.type) {
  case operations.TAB_CLOSE:
    return tabs.closeTab(tab.id);
  case operations.TAB_CLOSE_FORCE:
    return tabs.closeTabForce(tab.id);
  case operations.TAB_REOPEN:
    return tabs.reopenTab();
  case operations.TAB_PREV:
    return tabs.selectPrevTab(tab.index, operation.count);
  case operations.TAB_NEXT:
    return tabs.selectNextTab(tab.index, operation.count);
  case operations.TAB_FIRST:
    return tabs.selectFirstTab();
  case operations.TAB_LAST:
    return tabs.selectLastTab();
  case operations.TAB_PREV_SEL:
    return tabs.selectPrevSelTab();
  case operations.TAB_RELOAD:
    return tabs.reload(tab, operation.cache);
  case operations.TAB_PIN:
    return tabs.updateTabPinned(tab, true);
  case operations.TAB_UNPIN:
    return tabs.updateTabPinned(tab, false);
  case operations.TAB_TOGGLE_PINNED:
    return tabs.toggleTabPinned(tab);
  case operations.TAB_DUPLICATE:
    return tabs.duplicate(tab.id);
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
  case operations.COMMAND_SHOW_WINOPEN:
    if (operation.alter) {
      // alter url
      return sendConsoleShowCommand(tab, 'winopen ' + tab.url);
    }
    return sendConsoleShowCommand(tab, 'winopen ');
  case operations.COMMAND_SHOW_BUFFER:
    return sendConsoleShowCommand(tab, 'buffer ');
  case operations.FIND_START:
    return browser.tabs.sendMessage(tab.id, {
      type: messages.CONSOLE_SHOW_FIND
    });
  default:
    return Promise.resolve();
  }
};
/* eslint-enable complexity */

export { exec };
