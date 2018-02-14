import { SCROLL_GET, SCROLL_SET } from '../shared/messages';
import * as ipc from './ipc';

const get = (tabId) => {
  return ipc.send({
    type: SCROLL_GET,
    tabId,
  });
};

const set = (tabId, x, y) => {
  return ipc.send({
    type: SCROLL_SET,
    tabId,
    x,
    y,
  });
};

export { get, set };
