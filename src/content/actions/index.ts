import Redux from 'redux';
import Settings from '../../shared/Settings';
import * as keyUtils from '../../shared/utils/keys';

// Find
export const FIND_SET_KEYWORD = 'find.set.keyword';

// Settings
export const SETTING_SET = 'setting.set';

// User input
export const INPUT_KEY_PRESS = 'input.key.press';
export const INPUT_CLEAR_KEYS = 'input.clear.keys';

// Completion
export const COMPLETION_SET_ITEMS = 'completion.set.items';
export const COMPLETION_SELECT_NEXT = 'completions.select.next';
export const COMPLETION_SELECT_PREV = 'completions.select.prev';

// Follow
export const FOLLOW_CONTROLLER_ENABLE = 'follow.controller.enable';
export const FOLLOW_CONTROLLER_DISABLE = 'follow.controller.disable';
export const FOLLOW_CONTROLLER_KEY_PRESS = 'follow.controller.key.press';
export const FOLLOW_CONTROLLER_BACKSPACE = 'follow.controller.backspace';

// Mark
export const MARK_START_SET = 'mark.start.set';
export const MARK_START_JUMP = 'mark.start.jump';
export const MARK_CANCEL = 'mark.cancel';
export const MARK_SET_LOCAL = 'mark.set.local';

export const NOOP = 'noop';

export interface FindSetKeywordAction extends Redux.Action {
  type: typeof FIND_SET_KEYWORD;
  keyword: string;
  found: boolean;
}

export interface SettingSetAction extends Redux.Action {
  type: typeof SETTING_SET;
  settings: Settings,
}

export interface InputKeyPressAction extends Redux.Action {
  type: typeof INPUT_KEY_PRESS;
  key: keyUtils.Key;
}

export interface InputClearKeysAction extends Redux.Action {
  type: typeof INPUT_CLEAR_KEYS;
}

export interface FollowControllerEnableAction extends Redux.Action {
  type: typeof FOLLOW_CONTROLLER_ENABLE;
  newTab: boolean;
  background: boolean;
}

export interface FollowControllerDisableAction extends Redux.Action {
  type: typeof FOLLOW_CONTROLLER_DISABLE;
}

export interface FollowControllerKeyPressAction extends Redux.Action {
  type: typeof FOLLOW_CONTROLLER_KEY_PRESS;
  key: string;
}

export interface FollowControllerBackspaceAction extends Redux.Action {
  type: typeof FOLLOW_CONTROLLER_BACKSPACE;
}

export interface MarkStartSetAction extends Redux.Action {
  type: typeof MARK_START_SET;
}

export interface MarkStartJumpAction extends Redux.Action {
  type: typeof MARK_START_JUMP;
}

export interface MarkCancelAction extends Redux.Action {
  type: typeof MARK_CANCEL;
}

export interface MarkSetLocalAction extends Redux.Action {
  type: typeof MARK_SET_LOCAL;
  key: string;
  x: number;
  y: number;
}

export interface NoopAction extends Redux.Action {
  type: typeof NOOP;
}

export type FindAction = FindSetKeywordAction | NoopAction;
export type SettingAction = SettingSetAction;
export type InputAction = InputKeyPressAction | InputClearKeysAction;
export type FollowAction =
  FollowControllerEnableAction | FollowControllerDisableAction |
  FollowControllerKeyPressAction | FollowControllerBackspaceAction;
export type MarkAction =
  MarkStartSetAction | MarkStartJumpAction |
  MarkCancelAction | MarkSetLocalAction | NoopAction;

export type Action =
  FindAction |
  SettingAction |
  InputAction |
  FollowAction |
  MarkAction |
  NoopAction;
