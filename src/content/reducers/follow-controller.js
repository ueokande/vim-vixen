import actions from 'content/actions';

const defaultState = {
  enabled: false,
  newTab: false,
  background: false,
  keys: '',
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.FOLLOW_CONTROLLER_ENABLE:
    return { ...state,
      enabled: true,
      newTab: action.newTab,
      background: action.background,
      keys: '', };
  case actions.FOLLOW_CONTROLLER_DISABLE:
    return { ...state,
      enabled: false, };
  case actions.FOLLOW_CONTROLLER_KEY_PRESS:
    return { ...state,
      keys: state.keys + action.key, };
  case actions.FOLLOW_CONTROLLER_BACKSPACE:
    return { ...state,
      keys: state.keys.slice(0, -1), };
  default:
    return state;
  }
}
