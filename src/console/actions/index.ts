import Completions from "../Completions";
import CompletionType from "../../shared/CompletionType";
import ColorScheme from "../../shared/ColorScheme";

export const CONSOLE_HIDE = "console.hide";
export const CONSOLE_SHOW_COMMAND = "console.show.command";
export const CONSOLE_SHOW_ERROR = "console.show.error";
export const CONSOLE_SHOW_INFO = "console.show.info";
export const CONSOLE_HIDE_COMMAND = "console.hide.command";
export const CONSOLE_SET_CONSOLE_TEXT = "console.set.command";
export const CONSOLE_SHOW_FIND = "console.show.find";
export const CONSOLE_SET_COLORSCHEME = "completion.set.colorscheme";
export const COMPLETION_START_COMPLETION = "console.start.completion";
export const COMPLETION_SET_COMPLETIONS = "console.set.completions";
export const COMPLETION_COMPLETION_NEXT = "completion.completion.next";
export const COMPLETION_COMPLETION_PREV = "completion.completion.prev";

export interface HideAction {
  type: typeof CONSOLE_HIDE;
}

export interface ShowCommand {
  type: typeof CONSOLE_SHOW_COMMAND;
  text: string;
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

export interface SetColorSchemeAction {
  type: typeof CONSOLE_SET_COLORSCHEME;
  colorscheme: ColorScheme;
}

export interface CompletionStartCompletionAction {
  type: typeof COMPLETION_START_COMPLETION;
  completionTypes: CompletionType[];
}

export interface SetCompletionsAction {
  type: typeof COMPLETION_SET_COMPLETIONS;
  completions: Completions;
  completionSource: string;
}

export interface CompletionNextAction {
  type: typeof COMPLETION_COMPLETION_NEXT;
}

export interface CompletionPrevAction {
  type: typeof COMPLETION_COMPLETION_PREV;
}

export type ConsoleAction =
  | HideAction
  | ShowCommand
  | ShowFindAction
  | ShowErrorAction
  | ShowInfoAction
  | HideCommandAction
  | SetConsoleTextAction
  | SetColorSchemeAction;

export type CompletionAction =
  | CompletionStartCompletionAction
  | SetCompletionsAction
  | CompletionNextAction
  | CompletionPrevAction;
