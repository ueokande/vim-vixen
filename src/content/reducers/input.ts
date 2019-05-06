import * as actions from '../actions';
import * as keyUtils from '../../shared/utils/keys';

export interface State {
  keys: keyUtils.Key[],
}

const defaultState: State = {
  keys: []
};

export default function reducer(
  state: State = defaultState,
  action: actions.InputAction,
): State {
  switch (action.type) {
  case actions.INPUT_KEY_PRESS:
    return { ...state,
      keys: state.keys.concat([action.key]), };
  case actions.INPUT_CLEAR_KEYS:
    return { ...state,
      keys: [], };
  default:
    return state;
  }
}
