import {
  EVENT_KEYPRESS, EVENT_KEYDOWN, EVENT_KEYUP,
  SCROLL_GET, SCROLL_SET,
} from '../shared/messages';
import * as ipc from './ipc';
import * as scrolls from './scrolls';

ipc.receivePageMessage((message) => {
  return ipc.sendToBackground(message);
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
  case SCROLL_GET:
    return Promise.resolve(scrolls.get());
  case SCROLL_SET:
    return Promise.resolve(scrolls.set(message.x, message.y));
  }
  return Promise.resolve({});
});
