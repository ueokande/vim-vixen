import * as operations from './operations';

export const BACKGROUND_OPERATION = 'background.operation';

export const CONSOLE_UNFOCUS = 'console.unfocus';
export const CONSOLE_ENTER_COMMAND = 'console.enter.command';
export const CONSOLE_ENTER_FIND = 'console.enter.find';
export const CONSOLE_QUERY_COMPLETIONS = 'console.query.completions';
export const CONSOLE_SHOW_COMMAND = 'console.show.command';
export const CONSOLE_SHOW_ERROR = 'console.show.error';
export const CONSOLE_SHOW_INFO = 'console.show.info';
export const CONSOLE_SHOW_FIND = 'console.show.find';
export const CONSOLE_HIDE = 'console.hide';

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
export const FIND_GET_KEYWORD = 'find.get.keyword';
export const FIND_SET_KEYWORD = 'find.set.keyword';

export const ADDON_ENABLED_QUERY = 'addon.enabled.query';
export const ADDON_ENABLED_RESPONSE = 'addon.enabled.response';
export const ADDON_TOGGLE_ENABLED = 'addon.toggle.enabled';

export const OPEN_URL = 'open.url';

export const SETTINGS_CHANGED = 'settings.changed';
export const SETTINGS_QUERY = 'settings.query';

export const CONSOLE_FRAME_MESSAGE = 'console.frame.message';

interface BackgroundOperationMessage {
  type: typeof BACKGROUND_OPERATION;
  operation: operations.Operation;
}

interface ConsoleUnfocusMessage {
  type: typeof CONSOLE_UNFOCUS;
}

interface ConsoleEnterCommandMessage {
  type: typeof CONSOLE_ENTER_COMMAND;
  text: string;
}

interface ConsoleEnterFindMessage {
  type: typeof CONSOLE_ENTER_FIND;
  text: string;
}

interface ConsoleQueryCompletionsMessage {
  type: typeof CONSOLE_QUERY_COMPLETIONS;
  text: string;
}

interface ConsoleShowCommandMessage {
  type: typeof CONSOLE_SHOW_COMMAND;
  command: string;
}

interface ConsoleShowErrorMessage {
  type: typeof CONSOLE_SHOW_ERROR;
  text: string;
}

interface ConsoleShowInfoMessage {
  type: typeof CONSOLE_SHOW_INFO;
  text: string;
}

interface ConsoleShowFindMessage {
  type: typeof CONSOLE_SHOW_FIND;
}

interface ConsoleHideMessage {
  type: typeof CONSOLE_HIDE;
}

interface FollowStartMessage {
  type: typeof FOLLOW_START;
  newTab: boolean;
  background: boolean;
}

interface FollowRequestCountTargetsMessage {
  type: typeof FOLLOW_REQUEST_COUNT_TARGETS;
  viewSize: { width: number, height: number };
  framePosition: { x: number, y: number };
}

interface FollowResponseCountTargetsMessage {
  type: typeof FOLLOW_RESPONSE_COUNT_TARGETS;
  count: number;
}

interface FollowCreateHintsMessage {
  type: typeof FOLLOW_CREATE_HINTS;
  keysArray: string[];
  newTab: boolean;
  background: boolean;
}

interface FollowShowHintsMessage {
  type: typeof FOLLOW_SHOW_HINTS;
  keys: string;
}

interface FollowRemoveHintsMessage {
  type: typeof FOLLOW_REMOVE_HINTS;
}

interface FollowActivateMessage {
  type: typeof FOLLOW_ACTIVATE;
  keys: string;
}

interface FollowKeyPressMessage {
  type: typeof FOLLOW_KEY_PRESS;
  key: string;
  ctrlKey: boolean;
}

interface MarkSetGlobalMessage {
  type: typeof MARK_SET_GLOBAL;
  key: string;
  x: number;
  y: number;
}

interface MarkJumpGlobalMessage {
  type: typeof MARK_JUMP_GLOBAL;
  key: string;
}

interface TabScrollToMessage {
  type: typeof TAB_SCROLL_TO;
  x: number;
  y: number;
}

interface FindNextMessage {
  type: typeof FIND_NEXT;
}

interface FindPrevMessage {
  type: typeof FIND_PREV;
}

interface FindGetKeywordMessage {
  type: typeof FIND_GET_KEYWORD;
}

interface FindSetKeywordMessage {
  type: typeof FIND_SET_KEYWORD;
  keyword: string;
  found: boolean;
}

interface AddonEnabledQueryMessage {
  type: typeof ADDON_ENABLED_QUERY;
}

interface AddonEnabledResponseMessage {
  type: typeof ADDON_ENABLED_RESPONSE;
  enabled: boolean;
}

interface AddonToggleEnabledMessage {
  type: typeof ADDON_TOGGLE_ENABLED;
}

interface OpenUrlMessage {
  type: typeof OPEN_URL;
  url: string;
  newTab: boolean;
  background: boolean;
}

interface SettingsChangedMessage {
  type: typeof SETTINGS_CHANGED;
}

interface SettingsQueryMessage {
  type: typeof SETTINGS_QUERY;
}

interface ConsoleFrameMessageMessage {
  type: typeof CONSOLE_FRAME_MESSAGE;
  message: any;
}

export type Message =
  BackgroundOperationMessage |
  ConsoleUnfocusMessage |
  ConsoleEnterCommandMessage |
  ConsoleEnterFindMessage |
  ConsoleQueryCompletionsMessage |
  ConsoleShowCommandMessage |
  ConsoleShowErrorMessage |
  ConsoleShowInfoMessage |
  ConsoleShowFindMessage |
  ConsoleHideMessage |
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
  FindGetKeywordMessage |
  FindSetKeywordMessage |
  AddonEnabledQueryMessage |
  AddonEnabledResponseMessage |
  AddonToggleEnabledMessage |
  OpenUrlMessage |
  SettingsChangedMessage |
  SettingsQueryMessage |
  ConsoleFrameMessageMessage;

// eslint-disable-next-line complexity
export const valueOf = (o: any): Message => {
  switch (o.type) {
  case CONSOLE_UNFOCUS:
  case CONSOLE_ENTER_COMMAND:
  case CONSOLE_ENTER_FIND:
  case CONSOLE_QUERY_COMPLETIONS:
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
  case FIND_GET_KEYWORD:
  case FIND_SET_KEYWORD:
  case ADDON_ENABLED_QUERY:
  case ADDON_ENABLED_RESPONSE:
  case ADDON_TOGGLE_ENABLED:
  case OPEN_URL:
  case SETTINGS_CHANGED:
  case SETTINGS_QUERY:
  case CONSOLE_FRAME_MESSAGE:
    return o;
  }
  throw new Error('unknown operation type: ' + o.type);
};
