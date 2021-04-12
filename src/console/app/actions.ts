export const SHOW_COMMAND = "show.command";
export const SHOW_ERROR = "show.error";
export const SHOW_INFO = "show.info";
export const HIDE_COMMAND = "hide.command";
export const SHOW_FIND = "show.find";
export const HIDE = "hide";

export interface HideAction {
  type: typeof HIDE;
}

export interface ShowCommand {
  type: typeof SHOW_COMMAND;
  text: string;
}

export interface ShowFindAction {
  type: typeof SHOW_FIND;
}

export interface ShowErrorAction {
  type: typeof SHOW_ERROR;
  text: string;
}

export interface ShowInfoAction {
  type: typeof SHOW_INFO;
  text: string;
}

export interface HideCommandAction {
  type: typeof HIDE_COMMAND;
}

export type AppAction =
  | HideAction
  | ShowCommand
  | ShowFindAction
  | ShowErrorAction
  | ShowInfoAction
  | HideCommandAction;

const hide = (): HideAction => {
  return {
    type: HIDE,
  };
};

const showCommand = (text: string): ShowCommand => {
  return {
    type: SHOW_COMMAND,
    text,
  };
};

const showFind = (): ShowFindAction => {
  return {
    type: SHOW_FIND,
  };
};

const showError = (text: string): ShowErrorAction => {
  return {
    type: SHOW_ERROR,
    text: text,
  };
};

const showInfo = (text: string): ShowInfoAction => {
  return {
    type: SHOW_INFO,
    text: text,
  };
};

const hideCommand = (): HideCommandAction => {
  return {
    type: HIDE_COMMAND,
  };
};

export { hide, showCommand, showFind, showError, showInfo, hideCommand };
