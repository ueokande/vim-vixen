import {
  WINDOWS_CREATE, WINDOWS_REMOVE, WINDOWS_GET,
  TABS_CREATE,
  EVENT_KEYPRESS, EVENT_KEYDOWN, EVENT_KEYUP,
} from '../shared/messages';
import * as ipc from './ipc';

ipc.receivePageMessage((message) => {
  switch (message.type) {
  case WINDOWS_CREATE:
  case WINDOWS_REMOVE:
  case WINDOWS_GET:
  case TABS_CREATE:
  case EVENT_KEYPRESS:
  case EVENT_KEYDOWN:
  case EVENT_KEYUP:
    return ipc.sendToBackground(message);
  }
});

ipc.receiveBackgroundMesssage((message) => {
  switch (message.type) {
  case EVENT_KEYPRESS:
    document.body.dispatchEvent(
      new KeyboardEvent('keypress', { 'key': message.key }));
    break;
  case EVENT_KEYDOWN:
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', { 'key': message.key }));
    break;
  case EVENT_KEYUP:
    document.body.dispatchEvent(
      new KeyboardEvent('keyup', { 'key': message.key }));
    break;
  }
  return Promise.resolve({});
});
