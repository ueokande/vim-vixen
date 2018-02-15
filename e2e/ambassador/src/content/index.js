import {
  EVENT_KEYPRESS, EVENT_KEYDOWN, EVENT_KEYUP,
  SCROLL_GET, SCROLL_SET,
} from '../shared/messages';
import * as ipc from './ipc';
import * as events from './events';
import * as scrolls from './scrolls';

ipc.receivePageMessage((message) => {
  return ipc.sendToBackground(message);
});

ipc.receiveBackgroundMesssage((message) => {
  switch (message.type) {
  case EVENT_KEYPRESS:
    events.keypress(message);
    break;
  case EVENT_KEYDOWN:
    events.keydown(message);
    break;
  case EVENT_KEYUP:
    events.keyup(message);
    break;
  case SCROLL_GET:
    return Promise.resolve(scrolls.get());
  case SCROLL_SET:
    return Promise.resolve(scrolls.set(message.x, message.y));
  }
  return Promise.resolve({});
});
