import actions from 'actions';

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

const hide = () => {
  return {
    type: actions.CONSOLE_HIDE
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
  showCommand, showError, hide, setCompletions, completionNext, completionPrev
};
