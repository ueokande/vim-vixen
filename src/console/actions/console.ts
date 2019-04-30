import messages from 'shared/messages';
import actions from 'console/actions';

const hide = () => {
  return {
    type: actions.CONSOLE_HIDE,
  };
};

const showCommand = (text) => {
  return {
    type: actions.CONSOLE_SHOW_COMMAND,
    text: text
  };
};

const showFind = () => {
  return {
    type: actions.CONSOLE_SHOW_FIND,
  };
};

const showError = (text) => {
  return {
    type: actions.CONSOLE_SHOW_ERROR,
    text: text
  };
};

const showInfo = (text) => {
  return {
    type: actions.CONSOLE_SHOW_INFO,
    text: text
  };
};

const hideCommand = () => {
  window.top.postMessage(JSON.stringify({
    type: messages.CONSOLE_UNFOCUS,
  }), '*');
  return {
    type: actions.CONSOLE_HIDE_COMMAND,
  };
};

const enterCommand = async(text) => {
  await browser.runtime.sendMessage({
    type: messages.CONSOLE_ENTER_COMMAND,
    text,
  });
  return hideCommand(text);
};

const enterFind = (text) => {
  window.top.postMessage(JSON.stringify({
    type: messages.CONSOLE_ENTER_FIND,
    text,
  }), '*');
  return hideCommand();
};

const setConsoleText = (consoleText) => {
  return {
    type: actions.CONSOLE_SET_CONSOLE_TEXT,
    consoleText,
  };
};

const getCompletions = async(text) => {
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

const completionNext = () => {
  return {
    type: actions.CONSOLE_COMPLETION_NEXT,
  };
};

const completionPrev = () => {
  return {
    type: actions.CONSOLE_COMPLETION_PREV,
  };
};

export {
  hide, showCommand, showFind, showError, showInfo, hideCommand, setConsoleText,
  enterCommand, enterFind, getCompletions, completionNext, completionPrev
};
