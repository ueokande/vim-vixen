import actions from '../actions';

const defaultState = {
  keys: [],
  keymaps: {}
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.INPUT_KEY_PRESS:
    return Object.assign({}, state, {
      keys: state.keys.concat([
        {
          code: action.code,
          ctrl: action.ctrl
        }
      ])
    });
  case actions.INPUT_CLEAR_KEYS:
    return Object.assign({}, state, {
      keys: [],
    });
  case actions.INPUT_SET_KEYMAPS:
    return Object.assign({}, state, {
      keymaps: action.keymaps,
      keys: [],
    });
  default:
    return state;
  }
}
