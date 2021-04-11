import * as messages from "../../shared/messages";

export const CONSOLE_SHOW_COMMAND = "console.show.command";
export const CONSOLE_SHOW_ERROR = "console.show.error";
export const CONSOLE_SHOW_INFO = "console.show.info";
export const CONSOLE_HIDE_COMMAND = "console.hide.command";
export const CONSOLE_SHOW_FIND = "console.show.find";
export const CONSOLE_HIDE = "console.hide";

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

export type ConsoleAction =
  | HideAction
  | ShowCommand
  | ShowFindAction
  | ShowErrorAction
  | ShowInfoAction
  | HideCommandAction;

const hide = (): ConsoleAction => {
  return {
    type: CONSOLE_HIDE,
  };
};

const showCommand = (text: string): ShowCommand => {
  return {
    type: CONSOLE_SHOW_COMMAND,
    text,
  };
};

const showFind = (): ShowFindAction => {
  return {
    type: CONSOLE_SHOW_FIND,
  };
};

const showError = (text: string): ShowErrorAction => {
  return {
    type: CONSOLE_SHOW_ERROR,
    text: text,
  };
};

const showInfo = (text: string): ShowInfoAction => {
  return {
    type: CONSOLE_SHOW_INFO,
    text: text,
  };
};

const hideCommand = (): HideCommandAction => {
  window.top.postMessage(
    JSON.stringify({
      type: messages.CONSOLE_UNFOCUS,
    }),
    "*"
  );
  return {
    type: CONSOLE_HIDE_COMMAND,
  };
};

const enterCommand = async (text: string): Promise<HideCommandAction> => {
  await browser.runtime.sendMessage({
    type: messages.CONSOLE_ENTER_COMMAND,
    text,
  });
  return hideCommand();
};

const enterFind = (text?: string): HideCommandAction => {
  window.top.postMessage(
    JSON.stringify({
      type: messages.CONSOLE_ENTER_FIND,
      text,
    }),
    "*"
  );
  return hideCommand();
};

export {
  hide,
  showCommand,
  showFind,
  showError,
  showInfo,
  hideCommand,
  enterCommand,
  enterFind,
};
