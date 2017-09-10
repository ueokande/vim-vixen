import actions from '../actions';

const DEFAULT_KEYMAP = {
  ':': { type: actions.CMD_OPEN },
  'o': { type: actions.CMD_TABS_OPEN, alter: false },
  'O': { type: actions.CMD_TABS_OPEN, alter: true },
  'b': { type: actions.CMD_BUFFER },
  'k': { type: actions.SCROLL_LINES, count: -1 },
  'j': { type: actions.SCROLL_LINES, count: 1 },
  '<C-E>': { type: actions.SCROLL_LINES, count: -1 },
  '<C-Y>': { type: actions.SCROLL_LINES, count: 1 },
  '<C-U>': { type: actions.SCROLL_PAGES, count: -0.5 },
  '<C-D>': { type: actions.SCROLL_PAGES, count: 0.5 },
  '<C-B>': { type: actions.SCROLL_PAGES, count: -1 },
  '<C-F>': { type: actions.SCROLL_PAGES, count: 1 },
  'gg': { type: actions.SCROLL_TOP },
  'G': { type: actions.SCROLL_BOTTOM },
  '0': { type: actions.SCROLL_LEFT },
  '$': { type: actions.SCROLL_RIGHT },
  'd': { type: actions.TABS_CLOSE },
  'u': { type: actions.TABS_REOPEN },
  'h': { type: actions.TABS_PREV, count: 1 },
  'l': { type: actions.TABS_NEXT, count: 1 },
  'r': { type: actions.TABS_RELOAD, cache: false },
  'R': { type: actions.TABS_RELOAD, cache: true },
  'zi': { type: actions.ZOOM_IN },
  'zo': { type: actions.ZOOM_OUT },
  'zz': { type: actions.ZOOM_NEUTRAL },
  'f': { type: actions.FOLLOW_START, newTab: false },
  'F': { type: actions.FOLLOW_START, newTab: true },
  'H': { type: actions.HISTORY_PREV },
  'L': { type: actions.HISTORY_NEXT },
}

export default class KeyQueue {

  constructor(keymap = DEFAULT_KEYMAP) {
    this.data = [];
    this.keymap = keymap;
  }

  push(key) {
    this.data.push(key);

    let current = this.asKeymapChars();
    let filtered = Object.keys(this.keymap).filter((keys) => {
      return keys.startsWith(current);
    });

    if (filtered.length == 0) {
      this.data = [];
      return null;
    } else if (filtered.length === 1 && current === filtered[0]) {
      let action = this.keymap[filtered[0]];
      this.data = [];
      return action;
    }
    return null;
  }

  asKeymapChars() {
    return this.data.map((k) => {
      let c = String.fromCharCode(k.code);
      if (k.ctrl) {
        return '<C-' + c.toUpperCase() + '>';
      } else {
        return c
      }
    }).join('');
  }

  asCaretChars() {
    return this.data.map((k) => {
      let c = String.fromCharCode(k.code);
      if (k.ctrl) {
        return '^' + c.toUpperCase();
      } else {
        return c;
      }
    }).join('');
  }
}
