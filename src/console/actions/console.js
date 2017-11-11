import actions from 'console/actions';

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
  return {
    type: actions.CONSOLE_HIDE_COMMAND,
  };
};

const setConsoleText = (consoleText) => {
  return {
    type: actions.CONSOLE_SET_CONSOLE_TEXT,
    consoleText,
  };
};

const setCompletions = (completionSource, completions) => {
  return {
    type: actions.CONSOLE_SET_COMPLETIONS,
    completionSource,
    completions,
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
  showCommand, showFind, showError, showInfo, hideCommand, setConsoleText,
  setCompletions, completionNext, completionPrev
};
