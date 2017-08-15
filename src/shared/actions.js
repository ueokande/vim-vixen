export const CMD_OPEN = 'cmd.open';
export const CMD_TABS_OPEN = 'cmd.tabs.open';
export const TABS_PREV = 'tabs.prev';
export const TABS_NEXT = 'tabs.next';
export const SCROLL_UP = 'scroll.up';
export const SCROLL_DOWN = 'scroll.down';
export const SCROLL_TOP = 'scroll.top';
export const SCROLL_BOTTOM = 'scroll.bottom';

const BACKGROUND_ACTION_SET = new Set([
  TABS_PREV,
  TABS_NEXT
]);

const CONTENT_ACTION_SET = new Set([
  CMD_OPEN,
  CMD_TABS_OPEN,
  SCROLL_UP,
  SCROLL_DOWN,
  SCROLL_TOP,
  SCROLL_BOTTOM
]);

export const isBackgroundAction = (action) => {
  return BACKGROUND_ACTION_SET.has(action);
};

export const isContentAction = (action) => {
  return CONTENT_ACTION_SET.has(action);
};
