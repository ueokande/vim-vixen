import Redux from 'redux';
import Key from '../domains/Key';

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

export const NOOP = 'noop';

export interface InputKeyPressAction extends Redux.Action {
  type: typeof INPUT_KEY_PRESS;
  key: Key;
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

export interface NoopAction extends Redux.Action {
  type: typeof NOOP;
}

export type InputAction = InputKeyPressAction | InputClearKeysAction;
export type FollowAction =
  FollowControllerEnableAction | FollowControllerDisableAction |
  FollowControllerKeyPressAction | FollowControllerBackspaceAction;
export type MarkAction =
  MarkStartSetAction | MarkStartJumpAction | MarkCancelAction | NoopAction;

export type Action =
  InputAction |
  FollowAction |
  MarkAction |
  NoopAction;
