import actions from 'content/actions';

const defaultState = {
  keys: '',
  keymaps: {},
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.INPUT_KEY_PRESS:
    return Object.assign({}, state, {
      keys: state.keys + action.key
    });
  case actions.INPUT_CLEAR_KEYS:
    return Object.assign({}, state, {
      keys: '',
    });
  case actions.INPUT_SET_KEYMAPS:
    return Object.assign({}, state, {
      keymaps: action.keymaps,
    });
  default:
    return state;
  }
}
