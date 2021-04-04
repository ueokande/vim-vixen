import * as actions from "../actions";
import ColorScheme from "../../shared/ColorScheme";

export interface State {
  mode: string;
  messageText: string;
  consoleText: string;
  colorscheme: ColorScheme;
}

export const defaultState = {
  mode: "",
  messageText: "",
  consoleText: "",
  colorscheme: ColorScheme.System,
};

// eslint-disable-next-line max-lines-per-function
export default function reducer(
  state: State = defaultState,
  action: actions.ConsoleAction
): State {
  switch (action.type) {
    case actions.CONSOLE_HIDE:
      return { ...state, mode: "" };
    case actions.CONSOLE_SHOW_COMMAND:
      return {
        ...state,
        mode: "command",
        consoleText: action.text,
      };
    case actions.CONSOLE_SHOW_FIND:
      return { ...state, mode: "find", consoleText: "" };
    case actions.CONSOLE_SHOW_ERROR:
      return { ...state, mode: "error", messageText: action.text };
    case actions.CONSOLE_SHOW_INFO:
      return { ...state, mode: "info", messageText: action.text };
    case actions.CONSOLE_HIDE_COMMAND:
      return {
        ...state,
        mode:
          state.mode === "command" || state.mode === "find" ? "" : state.mode,
      };
    case actions.CONSOLE_SET_CONSOLE_TEXT:
      return { ...state, consoleText: action.consoleText };
    case actions.CONSOLE_SET_COLORSCHEME:
      return {
        ...state,
        colorscheme: action.colorscheme,
      };
    default:
      return state;
  }
}
