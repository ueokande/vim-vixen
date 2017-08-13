import * as keys from './keys';
import * as actions from '../shared/actions';

const DEFAULT_KEYMAP = [
  { keys: [{ code: KeyboardEvent.DOM_VK_K }], action: [ actions.SCROLL_UP, 1 ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_J }], action: [ actions.SCROLL_DOWN, 1 ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_H }], action: [ actions.TABS_PREV, 1 ]},
  { keys: [{ code: KeyboardEvent.DOM_VK_L }], action: [ actions.TABS_NEXT, 1 ]},
]

export default class KeyQueue {

  constructor(keymap) {
    this.data = [];
    this.keymap = keymap;
  }

  push(key) {
    this.data.push(key);
    for (let map of DEFAULT_KEYMAP) {
      if (keys.keysEquals(map.keys, this.data)) {
        this.data = [];
        return map.action
      }
    }
    return null;
  }
}
