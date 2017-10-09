import actions from 'settings/actions';

const defaultState = {
  source: '',
  json: '',
  value: {}
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.SETTING_SET_SETTINGS:
    return {
      source: action.source,
      json: action.json,
      value: action.value,
    };
  default:
    return state;
  }
}

