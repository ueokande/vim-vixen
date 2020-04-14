import * as operations from './operations';
import CompletionType from "./CompletionType";
import TabFlag from "./TabFlag";

export const BACKGROUND_OPERATION = 'background.operation';

export const CONSOLE_UNFOCUS = 'console.unfocus';
export const CONSOLE_ENTER_COMMAND = 'console.enter.command';
export const CONSOLE_ENTER_FIND = 'console.enter.find';
export const CONSOLE_SHOW_COMMAND = 'console.show.command';
export const CONSOLE_SHOW_ERROR = 'console.show.error';
export const CONSOLE_SHOW_INFO = 'console.show.info';
export const CONSOLE_SHOW_FIND = 'console.show.find';
export const CONSOLE_HIDE = 'console.hide';
export const CONSOLE_GET_COMPLETION_TYPES = 'console.get.completion.types';
export const CONSOLE_REQUEST_SEARCH_ENGINES_MESSAGE = 'console.qresut.searchEngines';
export const CONSOLE_REQUEST_BOOKMARKS = 'console.request.bookmarks';
export const CONSOLE_REQUEST_HISTORY = 'console.request.history';
export const CONSOLE_REQUEST_TABS = 'console.request.tabs';
export const CONSOLE_GET_PROPERTIES = 'console.get.properties';

export const FOLLOW_START = 'follow.start';
export const FOLLOW_REQUEST_COUNT_TARGETS = 'follow.request.count.targets';
export const FOLLOW_RESPONSE_COUNT_TARGETS = 'follow.response.count.targets';
export const FOLLOW_CREATE_HINTS = 'follow.create.hints';
export const FOLLOW_SHOW_HINTS = 'follow.update.hints';
export const FOLLOW_REMOVE_HINTS = 'follow.remove.hints';
export const FOLLOW_ACTIVATE = 'follow.activate';
export const FOLLOW_KEY_PRESS = 'follow.key.press';

export const MARK_SET_GLOBAL = 'mark.set.global';
export const MARK_JUMP_GLOBAL = 'mark.jump.global';

export const TAB_SCROLL_TO = 'tab.scroll.to';

export const FIND_NEXT = 'find.next';
export const FIND_PREV = 'find.prev';
export const FIND_SELECTION = 'find.selection';
export const FIND_GET_KEYWORD = 'find.get.keyword';
export const FIND_SET_KEYWORD = 'find.set.keyword';

export const ADDON_ENABLED_QUERY = 'addon.enabled.query';
export const ADDON_ENABLED_RESPONSE = 'addon.enabled.response';
export const ADDON_TOGGLE_ENABLED = 'addon.toggle.enabled';

export const OPEN_URL = 'open.url';

export const SETTINGS_CHANGED = 'settings.changed';
export const SETTINGS_QUERY = 'settings.query';

export const CONSOLE_FRAME_MESSAGE = 'console.frame.message';

export const NAVIGATE_HISTORY_NEXT = 'navigate.history.next';
export const NAVIGATE_HISTORY_PREV = 'navigate.history.prev';
export const NAVIGATE_LINK_NEXT = 'navigate.link.next';
export const NAVIGATE_LINK_PREV = 'navigate.link.prev';

export interface BackgroundOperationMessage {
  type: typeof BACKGROUND_OPERATION;
  repeat: number;
  operation: operations.Operation;
}

export interface ConsoleUnfocusMessage {
  type: typeof CONSOLE_UNFOCUS;
}

export interface ConsoleEnterCommandMessage {
  type: typeof CONSOLE_ENTER_COMMAND;
  text: string;
}

export interface ConsoleEnterFindMessage {
  type: typeof CONSOLE_ENTER_FIND;
  text?: string;
}

export interface ConsoleShowCommandMessage {
  type: typeof CONSOLE_SHOW_COMMAND;
  command: string;
}

export interface ConsoleShowErrorMessage {
  type: typeof CONSOLE_SHOW_ERROR;
  text: string;
}

export interface ConsoleShowInfoMessage {
  type: typeof CONSOLE_SHOW_INFO;
  text: string;
}

export interface ConsoleShowFindMessage {
  type: typeof CONSOLE_SHOW_FIND;
}

export interface ConsoleHideMessage {
  type: typeof CONSOLE_HIDE;
}

export interface ConsoleGetCompletionTypesMessage {
  type: typeof CONSOLE_GET_COMPLETION_TYPES;
}

export interface ConsoleRequestSearchEnginesMessage {
  type: typeof CONSOLE_REQUEST_SEARCH_ENGINES_MESSAGE;
  query: string
}

export interface ConsoleRequestBookmarksMessage {
  type: typeof CONSOLE_REQUEST_BOOKMARKS;
  query: string;
}

export interface ConsoleRequestHistoryMessage {
  type: typeof CONSOLE_REQUEST_HISTORY;
  query: string;
}

export interface ConsoleRequestTabsMessage {
  type: typeof CONSOLE_REQUEST_TABS;
  query: string;
  excludePinned: boolean;
}

export interface ConsoleGetPropertiesMessage {
  type: typeof CONSOLE_GET_PROPERTIES;
}

export type ConsoleRequesttabsResponse = {
  index: number
  flag: TabFlag
  title: string
  url: string
  faviconUrl?: string
}[]

export type ConsoleGetCompletionTypesResponse = CompletionType[];

export type ConsoleRequestSearchEnginesResponse = {
  title: string;
}[]

export type ConsoleRequestBookmarksResponse = {
    title: string;
    url: string;
}[]

export type ConsoleRequestHistoryResponse = {
  title: string;
  url: string;
}[]

export type ConsoleGetPropertiesResponse = {
  name: string
  type: 'string' | 'boolean' | 'number'
}[]

export interface FollowStartMessage {
  type: typeof FOLLOW_START;
  newTab: boolean;
  background: boolean;
}

export interface FollowRequestCountTargetsMessage {
  type: typeof FOLLOW_REQUEST_COUNT_TARGETS;
  viewSize: { width: number, height: number };
  framePosition: { x: number, y: number };
}

export interface FollowResponseCountTargetsMessage {
  type: typeof FOLLOW_RESPONSE_COUNT_TARGETS;
  count: number;
}

export interface FollowCreateHintsMessage {
  type: typeof FOLLOW_CREATE_HINTS;
  tags: string[];
  viewSize: { width: number, height: number };
  framePosition: { x: number, y: number };
}

export interface FollowShowHintsMessage {
  type: typeof FOLLOW_SHOW_HINTS;
  prefix: string;
}

export interface FollowRemoveHintsMessage {
  type: typeof FOLLOW_REMOVE_HINTS;
}

export interface FollowActivateMessage {
  type: typeof FOLLOW_ACTIVATE;
  tag: string;
  newTab: boolean;
  background: boolean;
}

export interface FollowKeyPressMessage {
  type: typeof FOLLOW_KEY_PRESS;
  key: string;
  ctrlKey: boolean;
}

export interface MarkSetGlobalMessage {
  type: typeof MARK_SET_GLOBAL;
  key: string;
  x: number;
  y: number;
}

export interface MarkJumpGlobalMessage {
  type: typeof MARK_JUMP_GLOBAL;
  key: string;
}

export interface TabScrollToMessage {
  type: typeof TAB_SCROLL_TO;
  x: number;
  y: number;
}

export interface FindSelectionMessage {
  type: typeof FIND_SELECTION;
}

export interface FindNextMessage {
  type: typeof FIND_NEXT;
}

export interface FindPrevMessage {
  type: typeof FIND_PREV;
}

export interface FindGetKeywordMessage {
  type: typeof FIND_GET_KEYWORD;
}

export interface FindSetKeywordMessage {
  type: typeof FIND_SET_KEYWORD;
  keyword: string;
  found: boolean;
}

export interface AddonEnabledQueryMessage {
  type: typeof ADDON_ENABLED_QUERY;
}

export interface AddonEnabledResponseMessage {
  type: typeof ADDON_ENABLED_RESPONSE;
  enabled: boolean;
}

export interface AddonToggleEnabledMessage {
  type: typeof ADDON_TOGGLE_ENABLED;
}

export interface OpenUrlMessage {
  type: typeof OPEN_URL;
  url: string;
  newTab: boolean;
  background: boolean;
}

export interface SettingsChangedMessage {
  type: typeof SETTINGS_CHANGED;
}

export interface SettingsQueryMessage {
  type: typeof SETTINGS_QUERY;
}

export interface ConsoleFrameMessageMessage {
  type: typeof CONSOLE_FRAME_MESSAGE;
  message: any;
}

export interface NavigateHistoryNextMessage {
  type: typeof NAVIGATE_HISTORY_NEXT;
}

export interface NavigateHistoryPrevMessage {
  type: typeof NAVIGATE_HISTORY_PREV;
}

export interface NavigateLinkNext {
  type: typeof NAVIGATE_LINK_NEXT;
}

export interface NavigateLinkPrev {
  type: typeof NAVIGATE_LINK_PREV;
}

export type Message =
  BackgroundOperationMessage |
  ConsoleUnfocusMessage |
  ConsoleEnterCommandMessage |
  ConsoleEnterFindMessage |
  ConsoleShowCommandMessage |
  ConsoleShowErrorMessage |
  ConsoleShowInfoMessage |
  ConsoleShowFindMessage |
  ConsoleHideMessage |
  ConsoleRequestBookmarksMessage |
  ConsoleRequestHistoryMessage |
  ConsoleRequestTabsMessage |
  ConsoleGetPropertiesMessage |
  ConsoleGetCompletionTypesMessage |
  ConsoleRequestSearchEnginesMessage |
  FollowStartMessage |
  FollowRequestCountTargetsMessage |
  FollowResponseCountTargetsMessage |
  FollowCreateHintsMessage |
  FollowShowHintsMessage |
  FollowRemoveHintsMessage |
  FollowActivateMessage |
  FollowKeyPressMessage |
  MarkSetGlobalMessage |
  MarkJumpGlobalMessage |
  TabScrollToMessage |
  FindNextMessage |
  FindPrevMessage |
  FindSelectionMessage |
  FindGetKeywordMessage |
  FindSetKeywordMessage |
  AddonEnabledQueryMessage |
  AddonEnabledResponseMessage |
  AddonToggleEnabledMessage |
  OpenUrlMessage |
  SettingsChangedMessage |
  SettingsQueryMessage |
  ConsoleFrameMessageMessage |
  NavigateHistoryNextMessage |
  NavigateHistoryPrevMessage |
  NavigateLinkNext |
  NavigateLinkPrev;

// eslint-disable-next-line complexity
export const valueOf = (o: any): Message => {
  switch (o.type) {
  case CONSOLE_UNFOCUS:
  case CONSOLE_ENTER_COMMAND:
  case CONSOLE_ENTER_FIND:
  case CONSOLE_SHOW_COMMAND:
  case CONSOLE_SHOW_ERROR:
  case CONSOLE_SHOW_INFO:
  case CONSOLE_SHOW_FIND:
  case CONSOLE_HIDE:
  case FOLLOW_START:
  case FOLLOW_REQUEST_COUNT_TARGETS:
  case FOLLOW_RESPONSE_COUNT_TARGETS:
  case FOLLOW_CREATE_HINTS:
  case FOLLOW_SHOW_HINTS:
  case FOLLOW_REMOVE_HINTS:
  case FOLLOW_ACTIVATE:
  case FOLLOW_KEY_PRESS:
  case MARK_SET_GLOBAL:
  case MARK_JUMP_GLOBAL:
  case TAB_SCROLL_TO:
  case FIND_NEXT:
  case FIND_PREV:
  case FIND_SELECTION:
  case FIND_GET_KEYWORD:
  case FIND_SET_KEYWORD:
  case ADDON_ENABLED_QUERY:
  case ADDON_ENABLED_RESPONSE:
  case ADDON_TOGGLE_ENABLED:
  case OPEN_URL:
  case SETTINGS_CHANGED:
  case SETTINGS_QUERY:
  case CONSOLE_FRAME_MESSAGE:
  case NAVIGATE_HISTORY_NEXT:
  case NAVIGATE_HISTORY_PREV:
  case NAVIGATE_LINK_NEXT:
  case NAVIGATE_LINK_PREV:
    return o;
  }
  throw new Error('unknown operation type: ' + o.type);
};
