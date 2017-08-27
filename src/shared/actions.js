export const CMD_OPEN = 'cmd.open';
export const CMD_TABS_OPEN = 'cmd.tabs.open';
export const TABS_CLOSE = 'tabs.close';
export const TABS_REOPEN = 'tabs.reopen';
export const TABS_PREV = 'tabs.prev';
export const TABS_NEXT = 'tabs.next';
export const TABS_RELOAD = 'tabs.reload';
export const SCROLL_LINES = 'scroll.lines';
export const SCROLL_PAGES = 'scroll.pages';
export const SCROLL_TOP = 'scroll.top';
export const SCROLL_BOTTOM = 'scroll.bottom';
export const SCROLL_LEFT= 'scroll.left';
export const SCROLL_RIGHT= 'scroll.right';
export const FOLLOW_START = 'follow.start';
export const HISTORY_PREV = 'history.prev';
export const HISTORY_NEXT = 'history.next';
export const ZOOM_IN = 'zoom.in';
export const ZOOM_OUT = 'zoom.out';
export const ZOOM_NEUTRAL = 'zoom.neutral';

const BACKGROUND_ACTION_SET = new Set([
  TABS_CLOSE,
  TABS_REOPEN,
  TABS_PREV,
  TABS_NEXT,
  TABS_RELOAD,
  ZOOM_IN,
  ZOOM_OUT,
  ZOOM_NEUTRAL
]);

const CONTENT_ACTION_SET = new Set([
  CMD_OPEN,
  CMD_TABS_OPEN,
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

export const isBackgroundAction = (action) => {
  return BACKGROUND_ACTION_SET.has(action);
};

export const isContentAction = (action) => {
  return CONTENT_ACTION_SET.has(action);
};
