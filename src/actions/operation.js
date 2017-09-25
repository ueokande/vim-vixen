import operations from '../operations';
import messages from '../messages';
import * as consoleActions from './console';
import * as tabs from '../background/tabs';
import * as zooms from '../background/zooms';

const exec = (operation, tab) => {
  switch (operation.type) {
  case operations.TABS_CLOSE:
    return tabs.closeTab(tab.id);
  case operations.TABS_REOPEN:
    return tabs.reopenTab();
  case operations.TABS_PREV:
    return tabs.selectPrevTab(tab.index, operation.count);
  case operations.TABS_NEXT:
    return tabs.selectNextTab(tab.index, operation.count);
  case operations.TABS_RELOAD:
    return tabs.reload(tab, operation.cache);
  case operations.ZOOM_IN:
    return zooms.zoomIn();
  case operations.ZOOM_OUT:
    return zooms.zoomOut();
  case operations.ZOOM_NEUTRAL:
    return zooms.neutral();
  case operations.COMMAND_OPEN:
    return consoleActions.showCommand('');
  case operations.COMMAND_TABS_OPEN:
    if (operation.alter) {
      // alter url
      return consoleActions.showCommand('open ' + tab.url);
    }
    return consoleActions.showCommand('open ');
  case operations.COMMAND_TABS_NEW:
    if (operation.alter) {
      // alter url
      return consoleActions.showCommand('tabopen ' + tab.url);
    }
    return consoleActions.showCommand('tabopen ');
  case operations.COMMAND_BUFFER:
    return consoleActions.showCommand('buffer ');
  default:
    return browser.tabs.sendMessage(tab.id, {
      type: messages.CONTENT_OPERATION,
      operation
    });
  }
};

export { exec };
