import * as actions from '../shared/actions';

const DEFAULT_KEYMAP = {
  ':': [ actions.CMD_OPEN ],
  'o': [ actions.CMD_TABS_OPEN, false ],
  'O': [ actions.CMD_TABS_OPEN, true ],
  'k': [ actions.SCROLL_LINES, -1 ],
  'j': [ actions.SCROLL_LINES, 1 ],
  '<C-E>': [ actions.SCROLL_LINES, -1 ],
  '<C-Y>': [ actions.SCROLL_LINES, 1 ],
  '<C-U>': [ actions.SCROLL_PAGES, -0.5 ],
  '<C-D>': [ actions.SCROLL_PAGES, 0.5 ],
  '<C-B>': [ actions.SCROLL_PAGES, -1 ],
  '<C-F>': [ actions.SCROLL_PAGES, 1 ],
  'gg': [ actions.SCROLL_TOP ],
  'G': [ actions.SCROLL_BOTTOM ],
  'd': [ actions.TABS_CLOSE ],
  'u': [ actions.TABS_REOPEN],
  'h': [ actions.TABS_PREV, 1 ],
  'l': [ actions.TABS_NEXT, 1 ],
  'r': [ actions.TABS_RELOAD, false ],
  'R': [ actions.TABS_RELOAD, true ],
  'zi': [ actions.ZOOM_IN ],
  'zo': [ actions.ZOOM_OUT ],
  'zz': [ actions.ZOOM_NEUTRAL],
  'f': [ actions.FOLLOW_START, false ],
  'F': [ actions.FOLLOW_START, true ],
  'H': [ actions.HISTORY_PREV ],
  'L': [ actions.HISTORY_NEXT ],
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
