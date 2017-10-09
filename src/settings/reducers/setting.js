import actions from 'settings/actions';

const defaultState = {
  json: '',
  value: {}
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.SETTING_SET_SETTINGS:
    return {
      json: action.json,
      value: action.value,
    };
  default:
    return state;
  }
}

