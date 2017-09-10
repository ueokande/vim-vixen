export const CMD_OPEN = 'cmd.open';
export const CMD_TABS_OPEN = 'cmd.tabs.open';
export const CMD_BUFFER = 'cmd.buffer';
export const SCROLL_LINES = 'scroll.lines';
export const SCROLL_PAGES = 'scroll.pages';
export const SCROLL_TOP = 'scroll.top';
export const SCROLL_BOTTOM = 'scroll.bottom';
export const SCROLL_LEFT= 'scroll.left';
export const SCROLL_RIGHT= 'scroll.right';
export const FOLLOW_START = 'follow.start';
export const HISTORY_PREV = 'history.prev';
export const HISTORY_NEXT = 'history.next';

const CONTENT_ACTION_SET = new Set([
  CMD_OPEN,
  CMD_TABS_OPEN,
  CMD_BUFFER,
  SCROLL_LINES,
  SCROLL_PAGES,
  SCROLL_TOP,
  SCROLL_BOTTOM,
  SCROLL_LEFT,
  SCROLL_RIGHT,
  FOLLOW_START,
  HISTORY_PREV,
  HISTORY_NEXT
]);

export const isContentAction = (action) => {
  return CONTENT_ACTION_SET.has(action);
};
