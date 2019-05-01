import messages from '../../shared/messages';
import * as actions from './index';

const hide = (): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_HIDE,
  };
};

const showCommand = (text: string): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_SHOW_COMMAND,
    text: text
  };
};

const showFind = (): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_SHOW_FIND,
  };
};

const showError = (text: string): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_SHOW_ERROR,
    text: text
  };
};

const showInfo = (text: string): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_SHOW_INFO,
    text: text
  };
};

const hideCommand = (): actions.ConsoleAction => {
  window.top.postMessage(JSON.stringify({
    type: messages.CONSOLE_UNFOCUS,
  }), '*');
  return {
    type: actions.CONSOLE_HIDE_COMMAND,
  };
};

const enterCommand = async(
  text: string,
): Promise<actions.ConsoleAction> => {
  await browser.runtime.sendMessage({
    type: messages.CONSOLE_ENTER_COMMAND,
    text,
  });
  return hideCommand();
};

const enterFind = (text: string): actions.ConsoleAction => {
  window.top.postMessage(JSON.stringify({
    type: messages.CONSOLE_ENTER_FIND,
    text,
  }), '*');
  return hideCommand();
};

const setConsoleText = (consoleText: string): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_SET_CONSOLE_TEXT,
    consoleText,
  };
};

const getCompletions = async(text: string): Promise<actions.ConsoleAction> => {
  let completions = await browser.runtime.sendMessage({
    type: messages.CONSOLE_QUERY_COMPLETIONS,
    text,
  });
  return {
    type: actions.CONSOLE_SET_COMPLETIONS,
    completions,
    completionSource: text,
  };
};

const completionNext = (): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_COMPLETION_NEXT,
  };
};

const completionPrev = (): actions.ConsoleAction => {
  return {
    type: actions.CONSOLE_COMPLETION_PREV,
  };
};

export {
  hide, showCommand, showFind, showError, showInfo, hideCommand, setConsoleText,
  enterCommand, enterFind, getCompletions, completionNext, completionPrev,
};
