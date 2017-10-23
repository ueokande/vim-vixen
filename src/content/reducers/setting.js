import actions from 'content/actions';

const defaultState = {};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.SETTING_SET:
    return Object.assign({}, action.value);
  default:
    return state;
  }
}

