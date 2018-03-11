import {
  WINDOWS_CREATE, WINDOWS_REMOVE, WINDOWS_GET,
  TABS_CREATE, TABS_SELECT_AT, TABS_GET_ZOOM, TABS_SET_ZOOM,
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
  case TABS_SELECT_AT:
    return tabs.selectAt({
      windowId: message.windowId,
      index: message.index,
    });
  case TABS_GET_ZOOM:
    return browser.tabs.getZoom(message.tabId);
  case TABS_SET_ZOOM:
    return browser.tabs.setZoom(message.tabId, message.factor);
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
