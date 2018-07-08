import messages from 'shared/messages';
import operations from 'shared/operations';
import * as tabs from '../shared//tabs';
import * as zooms from '../shared/zooms';
import * as consoleActions from '../actions/console';

export default class BackgroundComponent {
  constructor(store) {
    this.store = store;

    browser.runtime.onMessage.addListener((message, sender) => {
      try {
        return this.onMessage(message, sender);
      } catch (e) {
        return browser.tabs.sendMessage(sender.tab.id, {
          type: messages.CONSOLE_SHOW_ERROR,
          text: e.message,
        });
      }
    });
  }

  onMessage(message, sender) {
    switch (message.type) {
    case messages.BACKGROUND_OPERATION:
      return this.store.dispatch(
        this.exec(message.operation, sender.tab));
    }
  }

  // eslint-disable-next-line complexity, max-lines-per-function
  async exec(operation, tab) {
    let tabState = this.store.getState().tab;

    switch (operation.type) {
    case operations.TAB_CLOSE:
      await tabs.closeTab(tab.id);
      break;
    case operations.TAB_CLOSE_FORCE:
      await tabs.closeTabForce(tab.id);
      break;
    case operations.TAB_REOPEN:
      await tabs.reopenTab();
      break;
    case operations.TAB_PREV:
      await tabs.selectPrevTab(tab.index, operation.count);
      break;
    case operations.TAB_NEXT:
      await tabs.selectNextTab(tab.index, operation.count);
      break;
    case operations.TAB_FIRST:
      await tabs.selectFirstTab();
      break;
    case operations.TAB_LAST:
      await tabs.selectLastTab();
      break;
    case operations.TAB_PREV_SEL:
      if (tabState.previousSelected > 0) {
        await tabs.selectTab(tabState.previousSelected);
      }
      break;
    case operations.TAB_RELOAD:
      await tabs.reload(tab, operation.cache);
      break;
    case operations.TAB_PIN:
      await tabs.updateTabPinned(tab, true);
      break;
    case operations.TAB_UNPIN:
      await tabs.updateTabPinned(tab, false);
      break;
    case operations.TAB_TOGGLE_PINNED:
      await tabs.toggleTabPinned(tab);
      break;
    case operations.TAB_DUPLICATE:
      await tabs.duplicate(tab.id);
      break;
    case operations.ZOOM_IN:
      await zooms.zoomIn();
      break;
    case operations.ZOOM_OUT:
      await zooms.zoomOut();
      break;
    case operations.ZOOM_NEUTRAL:
      await zooms.neutral();
      break;
    case operations.COMMAND_SHOW:
      return consoleActions.showCommand(tab, '');
    case operations.COMMAND_SHOW_OPEN:
      if (operation.alter) {
        // alter url
        return consoleActions.showCommand(tab, 'open ' + tab.url);
      }
      return consoleActions.showCommand(tab, 'open ');
    case operations.COMMAND_SHOW_TABOPEN:
      if (operation.alter) {
        // alter url
        return consoleActions.showCommand(tab, 'tabopen ' + tab.url);
      }
      return consoleActions.showCommand(tab, 'tabopen ');
    case operations.COMMAND_SHOW_WINOPEN:
      if (operation.alter) {
        // alter url
        return consoleActions.showCommand(tab, 'winopen ' + tab.url);
      }
      return consoleActions.showCommand(tab, 'winopen ');
    case operations.COMMAND_SHOW_BUFFER:
      return consoleActions.showCommand(tab, 'buffer ');
    case operations.COMMAND_SHOW_ADDBOOKMARK:
      if (operation.alter) {
        return consoleActions.showCommand(tab, 'addbookmark ' + tab.title);
      }
      return consoleActions.showCommand(tab, 'addbookmark  ');
    case operations.FIND_START:
      return consoleActions.showFind(tab);
    case operations.CANCEL:
      return consoleActions.hide(tab);
    case operations.PAGE_SOURCE:
      await browser.tabs.create({
        url: 'view-source:' + tab.url,
        index: tab.index + 1,
        openerTabId: tab.id,
      });
      break;
    }
    return { type: '' };
  }
}
