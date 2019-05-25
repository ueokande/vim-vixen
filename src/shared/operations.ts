// Hide console; or cancel some user actions
export const CANCEL = 'cancel';

// Addons
export const ADDON_ENABLE = 'addon.enable';
export const ADDON_DISABLE = 'addon.disable';
export const ADDON_TOGGLE_ENABLED = 'addon.toggle.enabled';

// Command
export const COMMAND_SHOW = 'command.show';
export const COMMAND_SHOW_OPEN = 'command.show.open';
export const COMMAND_SHOW_TABOPEN = 'command.show.tabopen';
export const COMMAND_SHOW_WINOPEN = 'command.show.winopen';
export const COMMAND_SHOW_BUFFER = 'command.show.buffer';
export const COMMAND_SHOW_ADDBOOKMARK = 'command.show.addbookmark';

// Scrolls
export const SCROLL_VERTICALLY = 'scroll.vertically';
export const SCROLL_HORIZONALLY = 'scroll.horizonally';
export const SCROLL_PAGES = 'scroll.pages';
export const SCROLL_TOP = 'scroll.top';
export const SCROLL_BOTTOM = 'scroll.bottom';
export const SCROLL_HOME = 'scroll.home';
export const SCROLL_END = 'scroll.end';

// Follows
export const FOLLOW_START = 'follow.start';

// Navigations
export const NAVIGATE_HISTORY_PREV = 'navigate.history.prev';
export const NAVIGATE_HISTORY_NEXT = 'navigate.history.next';
export const NAVIGATE_LINK_PREV = 'navigate.link.prev';
export const NAVIGATE_LINK_NEXT = 'navigate.link.next';
export const NAVIGATE_PARENT = 'navigate.parent';
export const NAVIGATE_ROOT = 'navigate.root';

// Focus
export const FOCUS_INPUT = 'focus.input';

// Page
export const PAGE_SOURCE = 'page.source';
export const PAGE_HOME = 'page.home';

// Tabs
export const TAB_CLOSE = 'tabs.close';
export const TAB_CLOSE_FORCE = 'tabs.close.force';
export const TAB_CLOSE_RIGHT = 'tabs.close.right';
export const TAB_REOPEN = 'tabs.reopen';
export const TAB_PREV = 'tabs.prev';
export const TAB_NEXT = 'tabs.next';
export const TAB_FIRST = 'tabs.first';
export const TAB_LAST = 'tabs.last';
export const TAB_PREV_SEL = 'tabs.prevsel';
export const TAB_RELOAD = 'tabs.reload';
export const TAB_PIN = 'tabs.pin';
export const TAB_UNPIN = 'tabs.unpin';
export const TAB_TOGGLE_PINNED = 'tabs.pin.toggle';
export const TAB_DUPLICATE = 'tabs.duplicate';

// Zooms
export const ZOOM_IN = 'zoom.in';
export const ZOOM_OUT = 'zoom.out';
export const ZOOM_NEUTRAL = 'zoom.neutral';

// Url yank/paste
export const URLS_YANK = 'urls.yank';
export const URLS_PASTE = 'urls.paste';

// Find
export const FIND_START = 'find.start';
export const FIND_NEXT = 'find.next';
export const FIND_PREV = 'find.prev';

// Mark
export const MARK_SET_PREFIX = 'mark.set.prefix';
export const MARK_JUMP_PREFIX = 'mark.jump.prefix';

// Repeat
export const REPEAT_LAST = 'repeat.last';

// Internal
export const INTERNAL_OPEN_URL = 'internal.open.url';

export interface CancelOperation {
  type: typeof CANCEL;
}

export interface AddonEnableOperation {
  type: typeof ADDON_ENABLE;
}

export interface AddonDisableOperation {
  type: typeof ADDON_DISABLE;
}

export interface AddonToggleEnabledOperation {
  type: typeof ADDON_TOGGLE_ENABLED;
}

export interface CommandShowOperation {
  type: typeof COMMAND_SHOW;
}

export interface CommandShowOpenOperation {
  type: typeof COMMAND_SHOW_OPEN;
  alter: boolean;
}

export interface CommandShowTabopenOperation {
  type: typeof COMMAND_SHOW_TABOPEN;
  alter: boolean;
}

export interface CommandShowWinopenOperation {
  type: typeof COMMAND_SHOW_WINOPEN;
  alter: boolean;
}

export interface CommandShowBufferOperation {
  type: typeof COMMAND_SHOW_BUFFER;
}

export interface CommandShowAddbookmarkOperation {
  type: typeof COMMAND_SHOW_ADDBOOKMARK;
  alter: boolean;
}

export interface ScrollVerticallyOperation {
  type: typeof SCROLL_VERTICALLY;
  count: number;
}

export interface ScrollHorizonallyOperation {
  type: typeof SCROLL_HORIZONALLY;
  count: number;
}

export interface ScrollPagesOperation {
  type: typeof SCROLL_PAGES;
  count: number;
}

export interface ScrollTopOperation {
  type: typeof SCROLL_TOP;
}

export interface ScrollBottomOperation {
  type: typeof SCROLL_BOTTOM;
}

export interface ScrollHomeOperation {
  type: typeof SCROLL_HOME;
}

export interface ScrollEndOperation {
  type: typeof SCROLL_END;
}

export interface FollowStartOperation {
  type: typeof FOLLOW_START;
  newTab: boolean;
  background: boolean;
}

export interface NavigateHistoryPrevOperation {
  type: typeof NAVIGATE_HISTORY_PREV;
}

export interface NavigateHistoryNextOperation {
  type: typeof NAVIGATE_HISTORY_NEXT;
}

export interface NavigateLinkPrevOperation {
  type: typeof NAVIGATE_LINK_PREV;
}

export interface NavigateLinkNextOperation {
  type: typeof NAVIGATE_LINK_NEXT;
}

export interface NavigateParentOperation {
  type: typeof NAVIGATE_PARENT;
}

export interface NavigateRootOperation {
  type: typeof NAVIGATE_ROOT;
}

export interface FocusInputOperation {
  type: typeof FOCUS_INPUT;
}

export interface PageSourceOperation {
  type: typeof PAGE_SOURCE;
}

export interface PageHomeOperation {
  type: typeof PAGE_HOME;
  newTab: boolean;
}

export interface TabCloseOperation {
  type: typeof TAB_CLOSE;
}

export interface TabCloseForceOperation {
  type: typeof TAB_CLOSE_FORCE;
}

export interface TabCloseRightOperation {
  type: typeof TAB_CLOSE_RIGHT;
}

export interface TabReopenOperation {
  type: typeof TAB_REOPEN;
}

export interface TabPrevOperation {
  type: typeof TAB_PREV;
}

export interface TabNextOperation {
  type: typeof TAB_NEXT;
}

export interface TabFirstOperation {
  type: typeof TAB_FIRST;
}

export interface TabLastOperation {
  type: typeof TAB_LAST;
}

export interface TabPrevSelOperation {
  type: typeof TAB_PREV_SEL;
}

export interface TabReloadOperation {
  type: typeof TAB_RELOAD;
  cache: boolean;
}

export interface TabPinOperation {
  type: typeof TAB_PIN;
}

export interface TabUnpinOperation {
  type: typeof TAB_UNPIN;
}

export interface TabTogglePinnedOperation {
  type: typeof TAB_TOGGLE_PINNED;
}

export interface TabDuplicateOperation {
  type: typeof TAB_DUPLICATE;
}

export interface ZoomInOperation {
  type: typeof ZOOM_IN;
}

export interface ZoomOutOperation {
  type: typeof ZOOM_OUT;
}

export interface ZoomNeutralOperation {
  type: typeof ZOOM_NEUTRAL;
}

export interface UrlsYankOperation {
  type: typeof URLS_YANK;
}

export interface UrlsPasteOperation {
  type: typeof URLS_PASTE;
  newTab: boolean;
}

export interface FindStartOperation {
  type: typeof FIND_START;
}

export interface FindNextOperation {
  type: typeof FIND_NEXT;
}

export interface FindPrevOperation {
  type: typeof FIND_PREV;
}

export interface MarkSetPrefixOperation {
  type: typeof MARK_SET_PREFIX;
}

export interface MarkJumpPrefixOperation {
  type: typeof MARK_JUMP_PREFIX;
}

export interface RepeatLastOperation {
  type: typeof REPEAT_LAST;
}

export interface InternalOpenUrl {
  type: typeof INTERNAL_OPEN_URL;
  url: string;
  newTab?: boolean;
  newWindow?: boolean;
  background?: boolean;
}

export type Operation =
  CancelOperation |
  AddonEnableOperation |
  AddonDisableOperation |
  AddonToggleEnabledOperation |
  CommandShowOperation |
  CommandShowOpenOperation |
  CommandShowTabopenOperation |
  CommandShowWinopenOperation |
  CommandShowBufferOperation |
  CommandShowAddbookmarkOperation |
  ScrollVerticallyOperation |
  ScrollHorizonallyOperation |
  ScrollPagesOperation |
  ScrollTopOperation |
  ScrollBottomOperation |
  ScrollHomeOperation |
  ScrollEndOperation |
  FollowStartOperation |
  NavigateHistoryPrevOperation |
  NavigateHistoryNextOperation |
  NavigateLinkPrevOperation |
  NavigateLinkNextOperation |
  NavigateParentOperation |
  NavigateRootOperation |
  FocusInputOperation |
  PageSourceOperation |
  PageHomeOperation |
  TabCloseOperation |
  TabCloseForceOperation |
  TabCloseRightOperation |
  TabReopenOperation |
  TabPrevOperation |
  TabNextOperation |
  TabFirstOperation |
  TabLastOperation |
  TabPrevSelOperation |
  TabReloadOperation |
  TabPinOperation |
  TabUnpinOperation |
  TabTogglePinnedOperation |
  TabDuplicateOperation |
  ZoomInOperation |
  ZoomOutOperation |
  ZoomNeutralOperation |
  UrlsYankOperation |
  UrlsPasteOperation |
  FindStartOperation |
  FindNextOperation |
  FindPrevOperation |
  MarkSetPrefixOperation |
  MarkJumpPrefixOperation |
  RepeatLastOperation |
  InternalOpenUrl;

const assertOptionalBoolean = (obj: any, name: string) => {
  if (Object.prototype.hasOwnProperty.call(obj, name) &&
      typeof obj[name] !== 'boolean') {
    throw new TypeError(`Not a boolean parameter '${name}'`);
  }
};

const assertRequiredNumber = (obj: any, name: string) => {
  if (!Object.prototype.hasOwnProperty.call(obj, name) ||
    typeof obj[name] !== 'number') {
    throw new TypeError(`Missing number parameter '${name}`);
  }
};

const assertRequiredString = (obj: any, name: string) => {
  if (!Object.prototype.hasOwnProperty.call(obj, name) ||
    typeof obj[name] !== 'string') {
    throw new TypeError(`Missing string parameter '${name}`);
  }
};

// eslint-disable-next-line complexity, max-lines-per-function
export const valueOf = (o: any): Operation => {
  if (!Object.prototype.hasOwnProperty.call(o, 'type')) {
    throw new TypeError(`missing 'type' field`);
  }
  switch (o.type) {
  case COMMAND_SHOW_OPEN:
  case COMMAND_SHOW_TABOPEN:
  case COMMAND_SHOW_WINOPEN:
  case COMMAND_SHOW_ADDBOOKMARK:
    assertOptionalBoolean(o, 'alter');
    return { type: o.type, alter: Boolean(o.alter) };
  case SCROLL_VERTICALLY:
  case SCROLL_HORIZONALLY:
  case SCROLL_PAGES:
    assertRequiredNumber(o, 'count');
    return { type: o.type, count: Number(o.count) };
  case FOLLOW_START:
    assertOptionalBoolean(o, 'newTab');
    assertOptionalBoolean(o, 'background');
    return {
      type: FOLLOW_START,
      newTab: Boolean(typeof o.newTab === undefined ? false : o.newTab),
      background: Boolean(typeof o.background === undefined ? true : o.background), // eslint-disable-line max-len
    };
  case PAGE_HOME:
    assertOptionalBoolean(o, 'newTab');
    return {
      type: PAGE_HOME,
      newTab: Boolean(typeof o.newTab === undefined ? false : o.newTab),
    };
  case TAB_RELOAD:
    assertOptionalBoolean(o, 'cache');
    return {
      type: TAB_RELOAD,
      cache: Boolean(typeof o.cache === undefined ? false : o.cache),
    };
  case URLS_PASTE:
    assertOptionalBoolean(o, 'newTab');
    return {
      type: URLS_PASTE,
      newTab: Boolean(typeof o.newTab === undefined ? false : o.newTab),
    };
  case INTERNAL_OPEN_URL:
    assertOptionalBoolean(o, 'newTab');
    assertOptionalBoolean(o, 'newWindow');
    assertOptionalBoolean(o, 'background');
    assertRequiredString(o, 'url');
    return {
      type: INTERNAL_OPEN_URL,
      url: o.url,
      newTab: Boolean(typeof o.newTab === undefined ? false : o.newTab),
      newWindow: Boolean(typeof o.newWindow === undefined ? false : o.newWindow), // eslint-disable-line max-len
      background: Boolean(typeof o.background === undefined ? true : o.background), // eslint-disable-line max-len
    };
  case CANCEL:
  case ADDON_ENABLE:
  case ADDON_DISABLE:
  case ADDON_TOGGLE_ENABLED:
  case COMMAND_SHOW:
  case COMMAND_SHOW_BUFFER:
  case SCROLL_TOP:
  case SCROLL_BOTTOM:
  case SCROLL_HOME:
  case SCROLL_END:
  case NAVIGATE_HISTORY_PREV:
  case NAVIGATE_HISTORY_NEXT:
  case NAVIGATE_LINK_PREV:
  case NAVIGATE_LINK_NEXT:
  case NAVIGATE_PARENT:
  case NAVIGATE_ROOT:
  case FOCUS_INPUT:
  case PAGE_SOURCE:
  case TAB_CLOSE:
  case TAB_CLOSE_FORCE:
  case TAB_CLOSE_RIGHT:
  case TAB_REOPEN:
  case TAB_PREV:
  case TAB_NEXT:
  case TAB_FIRST:
  case TAB_LAST:
  case TAB_PREV_SEL:
  case TAB_PIN:
  case TAB_UNPIN:
  case TAB_TOGGLE_PINNED:
  case TAB_DUPLICATE:
  case ZOOM_IN:
  case ZOOM_OUT:
  case ZOOM_NEUTRAL:
  case URLS_YANK:
  case FIND_START:
  case FIND_NEXT:
  case FIND_PREV:
  case MARK_SET_PREFIX:
  case MARK_JUMP_PREFIX:
  case REPEAT_LAST:
    return { type: o.type };
  }
  throw new TypeError('unknown operation type: ' + o.type);
};
