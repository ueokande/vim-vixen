import actions from '../actions';

const defaultState = {
  mode: '',
  messageText: '',
  consoleText: '',
  completionSource: '',
  completions: [],
  groupSelection: -1,
  itemSelection: -1,
};

const nextSelection = (state) => {
  if (state.completions.length === 0) {
    return [-1, -1];
  }
  if (state.groupSelection < 0) {
    return [0, 0];
  }

  let group = state.completions[state.groupSelection];
  if (state.groupSelection + 1 >= state.completions.length &&
    state.itemSelection + 1 >= group.items.length) {
    return [-1, -1];
  }
  if (state.itemSelection + 1 >= group.items.length) {
    return [state.groupSelection + 1, 0];
  }
  return [state.groupSelection, state.itemSelection + 1];
};

const prevSelection = (state) => {
  if (state.groupSelection < 0) {
    return [
      state.completions.length - 1,
      state.completions[state.completions.length - 1].items.length - 1
    ];
  }
  if (state.groupSelection === 0 && state.itemSelection === 0) {
    return [-1, -1];
  } else if (state.itemSelection === 0) {
    return [
      state.groupSelection - 1,
      state.completions[state.groupSelection - 1].items.length - 1
    ];
  }
  return [state.groupSelection, state.itemSelection - 1];
};

const nextConsoleText = (completions, group, item, defaults) => {
  if (group < 0 || item < 0) {
    return defaults;
  }
  return completions[group].items[item].content;
};

// eslint-disable-next-line max-lines-per-function
export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.CONSOLE_HIDE:
    return { ...state,
      mode: '', };
  case actions.CONSOLE_SHOW_COMMAND:
    return { ...state,
      mode: 'command',
      consoleText: action.text,
      completions: []};
  case actions.CONSOLE_SHOW_FIND:
    return { ...state,
      mode: 'find',
      consoleText: '',
      completions: []};
  case actions.CONSOLE_SHOW_ERROR:
    return { ...state,
      mode: 'error',
      messageText: action.text, };
  case actions.CONSOLE_SHOW_INFO:
    return { ...state,
      mode: 'info',
      messageText: action.text, };
  case actions.CONSOLE_HIDE_COMMAND:
    return {
      ...state,
      mode: state.mode === 'command' || state.mode === 'find' ? '' : state.mode,
    };
  case actions.CONSOLE_SET_CONSOLE_TEXT:
    return { ...state,
      consoleText: action.consoleText, };
  case actions.CONSOLE_SET_COMPLETIONS:
    return { ...state,
      completions: action.completions,
      completionSource: action.completionSource,
      groupSelection: -1,
      itemSelection: -1, };
  case actions.CONSOLE_COMPLETION_NEXT: {
    let next = nextSelection(state);
    return { ...state,
      groupSelection: next[0],
      itemSelection: next[1],
      consoleText: nextConsoleText(
        state.completions, next[0], next[1],
        state.completionSource), };
  }
  case actions.CONSOLE_COMPLETION_PREV: {
    let next = prevSelection(state);
    return { ...state,
      groupSelection: next[0],
      itemSelection: next[1],
      consoleText: nextConsoleText(
        state.completions, next[0], next[1],
        state.completionSource), };
  }
  default:
    return state;
  }
}
