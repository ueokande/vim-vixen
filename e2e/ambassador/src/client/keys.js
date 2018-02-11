import { EVENT_KEYPRESS, EVENT_KEYDOWN, EVENT_KEYUP } from '../shared/messages';
import * as ipc from './ipc';

const press = (tabId, key) => {
  return ipc.send({
    type: EVENT_KEYPRESS,
    tabId,
    key,
  });
};

const down = (tabId, key) => {
  return ipc.send({
    type: EVENT_KEYDOWN,
    tabId,
    key,
  });
};


const up = (tabId, key) => {
  return ipc.send({
    type: EVENT_KEYUP,
    tabId,
    key,
  });
};

export { press, down, up };
