import * as messages from "../shared/messages";
import reducers, { defaultState } from "./reducers/console";
import * as consoleActions from "./actions/console";
import Console from "./components/Console";
import AppContext from "./components/AppContext";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import ColorSchemeProvider from "./colorscheme/providers";

const wrapAsync = <T extends unknown>(
  dispatch: React.Dispatch<T>
): React.Dispatch<T | Promise<T>> => {
  return (action: T | Promise<T>) => {
    if (action instanceof Promise) {
      action.then((a) => dispatch(a)).catch(console.error);
    } else {
      dispatch(action);
    }
  };
};

const RootComponent: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducers, defaultState);

  React.useEffect(() => {
    const onMessage = async (message: any): Promise<any> => {
      const msg = messages.valueOf(message);
      switch (msg.type) {
        case messages.CONSOLE_SHOW_COMMAND:
          return dispatch(await consoleActions.showCommand(msg.command));
        case messages.CONSOLE_SHOW_FIND:
          return dispatch(consoleActions.showFind());
        case messages.CONSOLE_SHOW_ERROR:
          return dispatch(consoleActions.showError(msg.text));
        case messages.CONSOLE_SHOW_INFO:
          return dispatch(consoleActions.showInfo(msg.text));
        case messages.CONSOLE_HIDE:
          return dispatch(consoleActions.hide());
      }
    };

    browser.runtime.onMessage.addListener(onMessage);
    const port = browser.runtime.connect(undefined, {
      name: "vimvixen-console",
    });
    port.onMessage.addListener(onMessage);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch: wrapAsync(dispatch) }}>
      <ColorSchemeProvider>
        <Console />
      </ColorSchemeProvider>
    </AppContext.Provider>
  );
};

window.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("vimvixen-console");
  ReactDOM.render(<RootComponent />, wrapper);
});
