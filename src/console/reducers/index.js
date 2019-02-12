import actions from 'console/actions';

const defaultState = {
  mode: '',
  messageText: '',
  consoleText: '',
  completionSource: '',
  completions: [],
  select: -1,
};

const nextSelection = (state) => {
  if (state.completions.length === 0) {
    return -1;
  }
  if (state.select < 0) {
    return 0;
  }

  let length = state.completions
    .map(g => g.items.length)
    .reduce((x, y) => x + y);
  if (state.select + 1 < length) {
    return state.select + 1;
  }
  return -1;
};

const prevSelection = (state) => {
  let length = state.completions
    .map(g => g.items.length)
    .reduce((x, y) => x + y);
  if (state.select < 0) {
    return length - 1;
  }
  return state.select - 1;
};

const nextConsoleText = (completions, select, defaults) => {
  if (select < 0) {
    return defaults;
  }
  let items = completions.map(g => g.items).reduce((g1, g2) => g1.concat(g2));
  return items[select].content;
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
      select: -1 };
  case actions.CONSOLE_COMPLETION_NEXT: {
    let select = nextSelection(state);
    return { ...state,
      select: select,
      consoleText: nextConsoleText(
        state.completions, select, state.completionSource) };
  }
  case actions.CONSOLE_COMPLETION_PREV: {
    let select = prevSelection(state);
    return { ...state,
      select: select,
      consoleText: nextConsoleText(
        state.completions, select, state.completionSource) };
  }
  default:
    return state;
  }
}
