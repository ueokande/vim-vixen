import { WINDOWS_CREATE, WINDOWS_REMOVE } from '../shared/messages';
import { receiveContentMessage } from './ipc';

receiveContentMessage((message) => {
  switch (message.type) {
  case WINDOWS_CREATE:
    return browser.windows.create();
  case WINDOWS_REMOVE:
    return browser.windows.remove(message.windowId);
  }
});

