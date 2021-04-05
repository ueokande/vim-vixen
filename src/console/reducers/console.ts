import {
  CONSOLE_HIDE,
  CONSOLE_HIDE_COMMAND,
  CONSOLE_SET_CONSOLE_TEXT,
  CONSOLE_SHOW_COMMAND,
  CONSOLE_SHOW_ERROR,
  CONSOLE_SHOW_FIND,
  CONSOLE_SHOW_INFO,
  ConsoleAction,
} from "../actions/console";

export interface State {
  mode: string;
  messageText: string;
  consoleText: string;
}

export const defaultState = {
  mode: "",
  messageText: "",
  consoleText: "",
};

// eslint-disable-next-line max-lines-per-function
export default function reducer(
  state: State = defaultState,
  action: ConsoleAction
): State {
  switch (action.type) {
    case CONSOLE_HIDE:
      return { ...state, mode: "" };
    case CONSOLE_SHOW_COMMAND:
      return {
        ...state,
        mode: "command",
        consoleText: action.text,
      };
    case CONSOLE_SHOW_FIND:
      return { ...state, mode: "find", consoleText: "" };
    case CONSOLE_SHOW_ERROR:
      return { ...state, mode: "error", messageText: action.text };
    case CONSOLE_SHOW_INFO:
      return { ...state, mode: "info", messageText: action.text };
    case CONSOLE_HIDE_COMMAND:
      return {
        ...state,
        mode:
          state.mode === "command" || state.mode === "find" ? "" : state.mode,
      };
    case CONSOLE_SET_CONSOLE_TEXT:
      return { ...state, consoleText: action.consoleText };
    default:
      return state;
  }
}
