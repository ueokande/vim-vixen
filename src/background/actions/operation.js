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

const exec = (operation, tab) => {
  switch (operation.type) {
  case operations.TAB_CLOSE:
    return tabs.closeTab(tab.id);
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
  case operations.COMMAND_SHOW_WINOPEN:
    if (operation.alter) {
      // alter url
      return sendConsoleShowCommand(tab, 'winopen ' + tab.url);
    }
    return sendConsoleShowCommand(tab, 'winopen ');
  case operations.COMMAND_SHOW_BUFFER:
    return sendConsoleShowCommand(tab, 'buffer ');
  default:
    return Promise.resolve();
  }
};

export { exec };
