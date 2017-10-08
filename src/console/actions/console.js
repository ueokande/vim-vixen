import actions from 'console/actions';

const showCommand = (text) => {
  return {
    type: actions.CONSOLE_SHOW_COMMAND,
    text: text
  };
};

const showError = (text) => {
  return {
    type: actions.CONSOLE_SHOW_ERROR,
    text: text
  };
};

const hideCommand = () => {
  return {
    type: actions.CONSOLE_HIDE_COMMAND,
  };
};

const setCompletions = (completions) => {
  return {
    type: actions.CONSOLE_SET_COMPLETIONS,
    completions: completions
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
  showCommand, showError, hideCommand,
  setCompletions, completionNext, completionPrev
};
