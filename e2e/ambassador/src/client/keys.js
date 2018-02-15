import { EVENT_KEYPRESS, EVENT_KEYDOWN, EVENT_KEYUP } from '../shared/messages';
import * as ipc from './ipc';

const NEUTRAL_MODIFIERS = { shiftKey: false, altKey: false, ctrlKey: false };

const press = (tabId, key, modifiers = NEUTRAL_MODIFIERS) => {
  return ipc.send(Object.assign({}, modifiers, {
    type: EVENT_KEYPRESS,
    tabId,
    key,
  }));
};

const down = (tabId, key, modifiers = NEUTRAL_MODIFIERS) => {
  return ipc.send(Object.assign({}, modifiers, {
    type: EVENT_KEYDOWN,
    tabId,
    key,
  }));
};


const up = (tabId, key, modifiers = NEUTRAL_MODIFIERS) => {
  return ipc.send(Object.assign({}, modifiers, {
    type: EVENT_KEYUP,
    tabId,
    key,
  }));
};

export { press, down, up };
