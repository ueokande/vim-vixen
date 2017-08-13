export const TABS_PREV = 'tabs.prev';
export const TABS_NEXT = 'tabs.next';
export const SCROLL_UP = 'scroll.up';
export const SCROLL_DOWN = 'scroll.down';

const BACKGROUND_ACTION_SET = new Set([
  TABS_PREV,
  TABS_NEXT
]);

const CONTENT_ACTION_SET = new Set([
  SCROLL_UP,
  SCROLL_DOWN
]);

export const isBackgroundAction = (action) => {
  return BACKGROUND_ACTION_SET.has(action);
};

export const isContentAction = (action) => {
  return CONTENT_ACTION_SET.has(action);
};
