import actions from '../actions';
import operations from '../operations';

const defaultKeymap = {
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
  'd': { type: operations.TABS_CLOSE },
  'u': { type: operations.TABS_REOPEN },
  'h': { type: operations.TABS_PREV, count: 1 },
  'l': { type: operations.TABS_NEXT, count: 1 },
  'r': { type: operations.TABS_RELOAD, cache: false },
  'R': { type: operations.TABS_RELOAD, cache: true },
  'zi': { type: operations.ZOOM_IN },
  'zo': { type: operations.ZOOM_OUT },
  'zz': { type: operations.ZOOM_NEUTRAL },
  'f': { type: actions.FOLLOW_START, newTab: false },
  'F': { type: actions.FOLLOW_START, newTab: true },
  'H': { type: actions.HISTORY_PREV },
  'L': { type: actions.HISTORY_NEXT },
}

const asKeymapChars = (keys) => {
  return keys.map((k) => {
    let c = String.fromCharCode(k.code);
    if (k.ctrl) {
      return '<C-' + c.toUpperCase() + '>';
    } else {
      return c
    }
  }).join('');
}

const asCaretChars = (keys) => {
  return keys.map((k) => {
    let c = String.fromCharCode(k.code);
    if (k.ctrl) {
      return '^' + c.toUpperCase();
    } else {
      return c;
    }
  }).join('');
}

export { defaultKeymap, asKeymapChars, asCaretChars };
