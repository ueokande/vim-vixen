import operations from '../operations';
import * as tabs from '../background/tabs';
import * as zooms from '../background/zooms';

export function exec(operation, sender) {
  switch (operation.type) {
  case operations.TABS_CLOSE:
    return tabs.closeTab(sender.tab.id);
  case operations.TABS_REOPEN:
    return tabs.reopenTab();
  case operations.TABS_PREV:
    return tabs.selectPrevTab(sender.tab.index, operation.count);
  case operations.TABS_NEXT:
    return tabs.selectNextTab(sender.tab.index, operation.count);
  case operations.TABS_RELOAD:
    return tabs.reload(sender.tab, operation.cache);
  case operations.ZOOM_IN:
    return zooms.zoomIn();
  case operations.ZOOM_OUT:
    return zooms.zoomOut();
  case operations.ZOOM_NEUTRAL:
    return zooms.neutral();
  default:
    return browser.tabs.sendMessage(sender.tab.id, {
      type: 'require.content.operation',
      operation
    });
  }
}

