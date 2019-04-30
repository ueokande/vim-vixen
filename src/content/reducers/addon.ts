import actions from 'content/actions';

const defaultState = {
  enabled: true,
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.ADDON_SET_ENABLED:
    return { ...state,
      enabled: action.enabled, };
  default:
    return state;
  }
}
