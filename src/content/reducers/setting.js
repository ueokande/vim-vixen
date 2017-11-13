import actions from 'content/actions';

const defaultState = {
  // keymaps is and arrays of key-binding pairs, which is entries of Map
  keymaps: [],
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.SETTING_SET:
    return Object.assign({}, action.value);
  default:
    return state;
  }
}

