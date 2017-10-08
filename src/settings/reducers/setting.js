import actions from 'settings/actions';

const defaultState = {
  settings: {}
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.SETTING_SET_SETTINGS:
    return Object.assign({}, state, {
      settings: action.settings,
    });
  default:
    return state;
  }
}

