import * as actions from '../actions';

export interface State {
  enabled: boolean;
}

const defaultState: State = {
  enabled: true,
};

export default function reducer(
  state: State = defaultState,
  action: actions.AddonAction,
): State {
  switch (action.type) {
  case actions.ADDON_SET_ENABLED:
    return { ...state,
      enabled: action.enabled, };
  default:
    return state;
  }
}
