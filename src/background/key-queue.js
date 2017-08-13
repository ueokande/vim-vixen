import * as keys from './keys';
import * as actions from '../shared/actions';

const DEFAULT_KEYMAP = [
  { keys: [{ code: KeyboardEvent.DOM_VK_SEMICOLON, shift: true }], action: [ actions.CMD_OPEN ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_K }], action: [ actions.SCROLL_UP, 1 ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_J }], action: [ actions.SCROLL_DOWN, 1 ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_G }, { code: KeyboardEvent.DOM_VK_G }], action: [ actions.SCROLL_TOP ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_G, shift: true }], action: [ actions.SCROLL_BOTTOM ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_H }], action: [ actions.TABS_PREV, 1 ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_L }], action: [ actions.TABS_NEXT, 1 ]},
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
