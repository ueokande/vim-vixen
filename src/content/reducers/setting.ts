import * as actions from '../actions';

export interface State {
  keymaps: any[];
}

const defaultState = {
  // keymaps is and arrays of key-binding pairs, which is entries of Map
  keymaps: [],
};

export default function reducer(
  state: State = defaultState,
  action: actions.SettingAction,
): State {
  switch (action.type) {
  case actions.SETTING_SET:
    return { ...action.value };
  default:
    return state;
  }
}

