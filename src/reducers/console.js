import actions from '../actions';

export const defaultState = {
  errorText: '',
  errorShown: false,
  commandText: '',
  commandShown: false,
  completions: [],
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.CONSOLE_SHOW_COMMAND:
    return Object.assign({}, state, {
      commandShown: true, 
      commandText: action.text,
      errorShow: false,
      completions: []
    });
  case actions.CONSOLE_SET_COMPLETIONS:
    return Object.assign({}, state, {
      completions: action.completions
    });
  case actions.CONSOLE_SHOW_ERROR:
    return Object.assign({}, state, {
      errorText: action.message,
      errorShow: true,
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
