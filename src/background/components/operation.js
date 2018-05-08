import messages from 'shared/messages';
import operations from 'shared/operations';
import * as tabs from '../shared//tabs';
import * as zooms from '../shared/zooms';

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
        this.exec(message.operation, sender.tab),
        sender);
    }
  }

  // eslint-disable-next-line complexity
  exec(operation, tab) {
    let tabState = this.store.getState().tab;

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
      if (tabState.previousSelected > 0) {
        return tabs.selectTab(tabState.previousSelected);
      }
      break;
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
      return this.sendConsoleShowCommand(tab, '');
    case operations.COMMAND_SHOW_OPEN:
      if (operation.alter) {
        // alter url
        return this.sendConsoleShowCommand(tab, 'open ' + tab.url);
      }
      return this.sendConsoleShowCommand(tab, 'open ');
    case operations.COMMAND_SHOW_TABOPEN:
      if (operation.alter) {
        // alter url
        return this.sendConsoleShowCommand(tab, 'tabopen ' + tab.url);
      }
      return this.sendConsoleShowCommand(tab, 'tabopen ');
    case operations.COMMAND_SHOW_WINOPEN:
      if (operation.alter) {
        // alter url
        return this.sendConsoleShowCommand(tab, 'winopen ' + tab.url);
      }
      return this.sendConsoleShowCommand(tab, 'winopen ');
    case operations.COMMAND_SHOW_BUFFER:
      return this.sendConsoleShowCommand(tab, 'buffer ');
    case operations.COMMAND_SHOW_ADDBOOKMARK:
      if (operation.alter) {
        return this.sendConsoleShowCommand(tab, 'addbookmark ' + tab.title);
      }
      return this.sendConsoleShowCommand(tab, 'addbookmark ');
    case operations.FIND_START:
      return browser.tabs.sendMessage(tab.id, {
        type: messages.CONSOLE_SHOW_FIND
      });
    case operations.CANCEL:
      return browser.tabs.sendMessage(tab.id, {
        type: messages.CONSOLE_HIDE,
      });
    case operations.PAGE_SOURCE:
      return browser.tabs.create({
        url: 'view-source:' + tab.url,
        index: tab.index + 1,
        openerTabId: tab.id,
      });
    default:
      return Promise.resolve();
    }
  }

  sendConsoleShowCommand(tab, command) {
    return browser.tabs.sendMessage(tab.id, {
      type: messages.CONSOLE_SHOW_COMMAND,
      command,
    });
  }
}
