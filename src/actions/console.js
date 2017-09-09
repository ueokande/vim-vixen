import actions from '../actions';

export function showCommand(text) {
  return {
    type: actions.CONSOLE_SHOW_COMMAND,
    text: text
  };
}

export function setCompletions(completions) {
  return { 
    type: actions.CONSOLE_SET_COMPLETIONS,
    completions: completions
  };
}

export function showError(text) {
  return {
    type: actions.CONSOLE_SHOW_ERROR,
    text: text
  };
}

export function hide() {
  return { 
    type: actions.CONSOLE_HIDE
  };
}
