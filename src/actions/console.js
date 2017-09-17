import actions from '../actions';

const showCommand = (text) => {
  return {
    type: actions.CONSOLE_SHOW_COMMAND,
    text: text
  };
};

const setCompletions = (completions) => {
  return {
    type: actions.CONSOLE_SET_COMPLETIONS,
    completions: completions
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

export { showCommand, setCompletions, showError, hide };
