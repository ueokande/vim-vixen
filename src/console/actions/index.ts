import Completions from "../Completions";
import CompletionType from "../../shared/CompletionType";

export const CONSOLE_HIDE = 'console.hide';
export const CONSOLE_SHOW_COMMAND = 'console.show.command';
export const CONSOLE_SHOW_ERROR = 'console.show.error';
export const CONSOLE_SHOW_INFO = 'console.show.info';
export const CONSOLE_HIDE_COMMAND = 'console.hide.command';
export const CONSOLE_SET_CONSOLE_TEXT = 'console.set.command';
export const CONSOLE_SET_COMPLETIONS = 'console.set.completions';
export const CONSOLE_COMPLETION_NEXT = 'console.completion.next';
export const CONSOLE_COMPLETION_PREV = 'console.completion.prev';
export const CONSOLE_SHOW_FIND = 'console.show.find';

export interface HideAction {
  type: typeof CONSOLE_HIDE;
}

export interface ShowCommand {
  type: typeof CONSOLE_SHOW_COMMAND;
  text: string;
  completionTypes: CompletionType[];
}

export interface ShowFindAction {
  type: typeof CONSOLE_SHOW_FIND;
}

export interface ShowErrorAction {
  type: typeof CONSOLE_SHOW_ERROR;
  text: string;
}

export interface ShowInfoAction {
  type: typeof CONSOLE_SHOW_INFO;
  text: string;
}

export interface HideCommandAction {
  type: typeof CONSOLE_HIDE_COMMAND;
}

export interface SetConsoleTextAction {
  type: typeof CONSOLE_SET_CONSOLE_TEXT;
  consoleText: string;
}

export interface SetCompletionsAction {
  type: typeof CONSOLE_SET_COMPLETIONS;
  completions: Completions;
  completionSource: string;
}

export interface CompletionNextAction {
  type: typeof CONSOLE_COMPLETION_NEXT;
}

export interface CompletionPrevAction {
  type: typeof CONSOLE_COMPLETION_PREV;
}

export type ConsoleAction =
  HideAction | ShowCommand | ShowFindAction | ShowErrorAction |
  ShowInfoAction | HideCommandAction | SetConsoleTextAction |
  SetCompletionsAction | CompletionNextAction | CompletionPrevAction;

