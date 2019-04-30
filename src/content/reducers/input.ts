import actions from 'content/actions';

const defaultState = {
  keys: []
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.INPUT_KEY_PRESS:
    return { ...state,
      keys: state.keys.concat([action.key]), };
  case actions.INPUT_CLEAR_KEYS:
    return { ...state,
      keys: [], };
  default:
    return state;
  }
}
