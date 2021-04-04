import * as messages from "../../shared/messages";
import * as actions from "./index";
import SettingClient from "../clients/SettingClient";

const settingClient = new SettingClient();

const hide = (): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_HIDE,
  };
};

const showCommand = (text: string): actions.ShowCommand => {
  return {
    type: actions.CONSOLE_SHOW_COMMAND,
    text,
  };
};

const showFind = (): actions.ShowFindAction => {
  return {
    type: actions.CONSOLE_SHOW_FIND,
  };
};

const showError = (text: string): actions.ShowErrorAction => {
  return {
    type: actions.CONSOLE_SHOW_ERROR,
    text: text,
  };
};

const showInfo = (text: string): actions.ShowInfoAction => {
  return {
    type: actions.CONSOLE_SHOW_INFO,
    text: text,
  };
};

const hideCommand = (): actions.HideCommandAction => {
  window.top.postMessage(
    JSON.stringify({
      type: messages.CONSOLE_UNFOCUS,
    }),
    "*"
  );
  return {
    type: actions.CONSOLE_HIDE_COMMAND,
  };
};

const enterCommand = async (
  text: string
): Promise<actions.HideCommandAction> => {
  await browser.runtime.sendMessage({
    type: messages.CONSOLE_ENTER_COMMAND,
    text,
  });
  return hideCommand();
};

const enterFind = (text?: string): actions.HideCommandAction => {
  window.top.postMessage(
    JSON.stringify({
      type: messages.CONSOLE_ENTER_FIND,
      text,
    }),
    "*"
  );
  return hideCommand();
};

const setConsoleText = (consoleText: string): actions.SetConsoleTextAction => {
  return {
    type: actions.CONSOLE_SET_CONSOLE_TEXT,
    consoleText,
  };
};

const setColorScheme = async (): Promise<actions.SetColorSchemeAction> => {
  const scheme = await settingClient.getColorScheme();
  return {
    type: actions.CONSOLE_SET_COLORSCHEME,
    colorscheme: scheme,
  };
};

export {
  hide,
  showCommand,
  showFind,
  showError,
  showInfo,
  hideCommand,
  setConsoleText,
  enterCommand,
  enterFind,
  setColorScheme,
};
