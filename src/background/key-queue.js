import * as keys from './keys';
import * as actions from '../shared/actions';

const DEFAULT_KEYMAP = [
  { keys: [{ code: KeyboardEvent.DOM_VK_SEMICOLON, shift: true }], action: [ actions.CMD_OPEN ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_O }], action: [ actions.CMD_TABS_OPEN, false ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_O, shift: true }], action: [ actions.CMD_TABS_OPEN, true ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_K }], action: [ actions.SCROLL_UP, 1 ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_J }], action: [ actions.SCROLL_DOWN, 1 ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_G }, { code: KeyboardEvent.DOM_VK_G }], action: [ actions.SCROLL_TOP ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_G, shift: true }], action: [ actions.SCROLL_BOTTOM ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_D }], action: [ actions.TABS_CLOSE ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_U }], action: [ actions.TABS_REOPEN]},
  { keys: [{ code: KeyboardEvent.DOM_VK_H }], action: [ actions.TABS_PREV, 1 ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_L }], action: [ actions.TABS_NEXT, 1 ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_Z }, { code: KeyboardEvent.DOM_VK_I }], action: [ actions.ZOOM_IN ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_Z }, { code: KeyboardEvent.DOM_VK_O }], action: [ actions.ZOOM_OUT ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_F }], action: [ actions.FOLLOW_START, false ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_F, shift: true }], action: [ actions.FOLLOW_START, true ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_H, shift: true }], action: [ actions.HISTORY_PREV ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_L, shift: true }], action: [ actions.HISTORY_NEXT ]},
]

export default class KeyQueue {

  constructor() {
    this.data = [];
    this.keymap = DEFAULT_KEYMAP;
  }

  push(key) {
    this.data.push(key);
    let filtered = this.keymap.filter((map) => {
      return keys.hasPrefix(map.keys, this.data)
    });

    if (filtered.length == 0) {
      this.data = [];
      return null;
    } else if (filtered.length == 1) {
      let map = filtered[0];
      if (map.keys.length == this.data.length) {
        this.data = [];
        return map.action;
      }
    }
    return null;
  }

  queuedKeys() {
    return this.data;
  }
}
