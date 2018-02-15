import {
  WINDOWS_CREATE, WINDOWS_REMOVE, WINDOWS_GET,
  TABS_CREATE,
  EVENT_KEYPRESS, EVENT_KEYDOWN, EVENT_KEYUP,
  SCROLL_GET, SCROLL_SET,
} from '../shared/messages';
import * as tabs from './tabs';
import { receiveContentMessage } from './ipc';

receiveContentMessage((message) => {
  switch (message.type) {
  case WINDOWS_CREATE:
    return browser.windows.create({ url: message.url });
  case WINDOWS_REMOVE:
    return browser.windows.remove(message.windowId);
  case WINDOWS_GET:
    return browser.windows.get(message.windowId, { populate: true });
  case TABS_CREATE:
    return tabs.create({
      url: message.url,
      windowId: message.windowId,
    });
  case EVENT_KEYPRESS:
  case EVENT_KEYDOWN:
  case EVENT_KEYUP:
  case SCROLL_GET:
  case SCROLL_SET:
    return browser.tabs.sendMessage(
      message.tabId,
      message
    );
  }
});
