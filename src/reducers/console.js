import actions from '../actions';

const defaultState = {
  errorShown: false,
  errorText: '',
  commandShown: false,
  commandText: '',
  completions: [],
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.CONSOLE_SHOW_COMMAND:
    return Object.assign({}, state, {
      commandShown: true, 
      commandText: action.text,
      errorShown: false,
      completions: []
    });
  case actions.CONSOLE_SET_COMPLETIONS:
    return Object.assign({}, state, {
      completions: action.completions
    });
  case actions.CONSOLE_SHOW_ERROR:
    return Object.assign({}, state, {
      errorText: action.text,
      errorShown: true,
      commandShown: false,
    });
  case actions.CONSOLE_HIDE:
    return Object.assign({}, state, {
      errorShown: false,
      commandShown: false
      
    });
  default:
    return state;
  }
}
