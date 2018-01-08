import actions from 'settings/actions';

const defaultState = {
  value: {},
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.SETTING_SET_SETTINGS:
    return {
      value: action.value,
    };
  default:
    return state;
  }
}

