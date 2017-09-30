import operations from '../operations';
import messages from '../content/messages';
import * as consoleActions from './console';
import * as tabs from '../background/tabs';
import * as zooms from '../background/zooms';

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
  case operations.TAB_RELOAD:
    return tabs.reload(tab, operation.cache);
  case operations.ZOOM_IN:
    return zooms.zoomIn();
  case operations.ZOOM_OUT:
    return zooms.zoomOut();
  case operations.ZOOM_NEUTRAL:
    return zooms.neutral();
  case operations.COMMAND_SHOW:
    return consoleActions.showCommand('');
  case operations.COMMAND_SHOW_OPEN:
    if (operation.alter) {
      // alter url
      return consoleActions.showCommand('open ' + tab.url);
    }
    return consoleActions.showCommand('open ');
  case operations.COMMAND_SHOW_TABOPEN:
    if (operation.alter) {
      // alter url
      return consoleActions.showCommand('tabopen ' + tab.url);
    }
    return consoleActions.showCommand('tabopen ');
  case operations.COMMAND_SHOW_BUFFER:
    return consoleActions.showCommand('buffer ');
  default:
    return browser.tabs.sendMessage(tab.id, {
      type: messages.CONTENT_OPERATION,
      operation
    });
  }
};

export { exec };
