import {
  HIDE,
  HIDE_COMMAND,
  SHOW_COMMAND,
  SHOW_ERROR,
  SHOW_FIND,
  SHOW_INFO,
  AppAction,
} from "./actions";

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
  action: AppAction
): State {
  switch (action.type) {
    case HIDE:
      return { ...state, mode: "" };
    case SHOW_COMMAND:
      return {
        ...state,
        mode: "command",
        consoleText: action.text,
      };
    case SHOW_FIND:
      return { ...state, mode: "find", consoleText: "" };
    case SHOW_ERROR:
      return { ...state, mode: "error", messageText: action.text };
    case SHOW_INFO:
      return { ...state, mode: "info", messageText: action.text };
    case HIDE_COMMAND:
      return {
        ...state,
        mode:
          state.mode === "command" || state.mode === "find" ? "" : state.mode,
      };
    default:
      return state;
  }
}
