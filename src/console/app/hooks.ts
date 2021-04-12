import React from "react";
import * as actions from "./actions";
import { AppDispatchContext, AppStateContext } from "./contexts";
import * as messages from "../../shared/messages";

export const useHide = () => {
  const dispatch = React.useContext(AppDispatchContext);
  const hide = React.useCallback(() => {
    window.top.postMessage(
      JSON.stringify({
        type: messages.CONSOLE_UNFOCUS,
      }),
      "*"
    );
    dispatch(actions.hide());
  }, [dispatch]);

  return hide;
};

export const useCommandMode = () => {
  const state = React.useContext(AppStateContext);
  const dispatch = React.useContext(AppDispatchContext);

  const show = React.useCallback(
    (initialInputValue: string) => {
      dispatch(actions.showCommand(initialInputValue));
    },
    [dispatch]
  );

  return {
    visible: state.mode === "command",
    initialInputValue: state.consoleText,
    show,
  };
};

export const useFindMode = () => {
  const state = React.useContext(AppStateContext);
  const dispatch = React.useContext(AppDispatchContext);

  const show = React.useCallback(() => {
    dispatch(actions.showFind());
  }, [dispatch]);

  return {
    visible: state.mode === "find",
    show,
  };
};

export const useInfoMessage = () => {
  const state = React.useContext(AppStateContext);
  const dispatch = React.useContext(AppDispatchContext);

  const show = React.useCallback(
    (message: string) => {
      dispatch(actions.showInfo(message));
    },
    [dispatch]
  );

  return {
    visible: state.mode === "info",
    message: state.mode === "info" ? state.messageText : "",
    show,
  };
};

export const useErrorMessage = () => {
  const state = React.useContext(AppStateContext);
  const dispatch = React.useContext(AppDispatchContext);

  const show = React.useCallback(
    (message: string) => {
      dispatch(actions.showError(message));
    },
    [dispatch]
  );

  return {
    visible: state.mode === "error",
    message: state.mode === "error" ? state.messageText : "",
    show,
  };
};

export const getInitialInputValue = () => {
  const state = React.useContext(AppStateContext);
  return state.consoleText;
};

export const useExecCommand = () => {
  const execCommand = React.useCallback((text: string) => {
    browser.runtime.sendMessage({
      type: messages.CONSOLE_ENTER_COMMAND,
      text,
    });
  }, []);
  return execCommand;
};

export const useExecFind = () => {
  const execFind = React.useCallback((text?: string) => {
    window.top.postMessage(
      JSON.stringify({
        type: messages.CONSOLE_ENTER_FIND,
        text,
      }),
      "*"
    );
  }, []);
  return execFind;
};
