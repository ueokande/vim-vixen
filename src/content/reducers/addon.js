import actions from 'content/actions';

const defaultState = {
  enabled: true,
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.ADDON_ENABLE:
    return Object.assign({}, state, {
      enabled: true,
    });
  case actions.ADDON_DISABLE:
    return Object.assign({}, state, {
      enabled: false,
    });
  case actions.ADDON_TOGGLE_ENABLED:
    return Object.assign({}, state, {
      enabled: !state.enabled,
    });
  default:
    return state;
  }
}
