import operations from '../operations';

const defaultKeymap = {
  ':': { type: operations.COMMAND_SHOW },
  'o': { type: operations.COMMAND_SHOW_OPEN, alter: false },
  'O': { type: operations.COMMAND_SHOW_OPEN, alter: true },
  't': { type: operations.COMMAND_SHOW_TABOPEN, alter: false },
  'T': { type: operations.COMMAND_SHOW_TABOPEN, alter: true },
  'b': { type: operations.COMMAND_SHOW_BUFFER },
  'k': { type: operations.SCROLL_LINES, count: -1 },
  'j': { type: operations.SCROLL_LINES, count: 1 },
  '<C-E>': { type: operations.SCROLL_LINES, count: -1 },
  '<C-Y>': { type: operations.SCROLL_LINES, count: 1 },
  '<C-U>': { type: operations.SCROLL_PAGES, count: -0.5 },
  '<C-D>': { type: operations.SCROLL_PAGES, count: 0.5 },
  '<C-B>': { type: operations.SCROLL_PAGES, count: -1 },
  '<C-F>': { type: operations.SCROLL_PAGES, count: 1 },
  'gg': { type: operations.SCROLL_TOP },
  'G': { type: operations.SCROLL_BOTTOM },
  '0': { type: operations.SCROLL_HOME },
  '$': { type: operations.SCROLL_END },
  'd': { type: operations.TAB_CLOSE },
  'u': { type: operations.TAB_REOPEN },
  'h': { type: operations.TAB_PREV, count: 1 },
  'l': { type: operations.TAB_NEXT, count: 1 },
  'r': { type: operations.TAB_RELOAD, cache: false },
  'R': { type: operations.TAB_RELOAD, cache: true },
  'zi': { type: operations.ZOOM_IN },
  'zo': { type: operations.ZOOM_OUT },
  'zz': { type: operations.ZOOM_NEUTRAL },
  'f': { type: operations.FOLLOW_START, newTab: false },
  'F': { type: operations.FOLLOW_START, newTab: true },
  'H': { type: operations.NAVIGATE_HISTORY_PREV },
  'L': { type: operations.NAVIGATE_HISTORY_NEXT },
  '[[': { type: operations.NAVIGATE_LINK_PREV },
  ']]': { type: operations.NAVIGATE_LINK_NEXT },
  'gu': { type: operations.NAVIGATE_PARENT },
  'gU': { type: operations.NAVIGATE_ROOT },
};

const asKeymapChars = (keys) => {
  return keys.map((k) => {
    let c = String.fromCharCode(k.code);
    if (k.ctrl) {
      return '<C-' + c.toUpperCase() + '>';
    }
    return c;
  }).join('');
};

const asCaretChars = (keys) => {
  return keys.map((k) => {
    let c = String.fromCharCode(k.code);
    if (k.ctrl) {
      return '^' + c.toUpperCase();
    }
    return c;
  }).join('');
};

export { defaultKeymap, asKeymapChars, asCaretChars };
