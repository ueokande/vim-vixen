import * as actions from '../actions';
import * as keyUtils from '../../shared/utils/keys';
import * as operations from '../../shared/operations';
import { Properties } from '../../shared/Settings';

export interface State {
  keymaps: { key: keyUtils.Key[], op: operations.Operation }[];
  properties: Properties;
}

const defaultState: State = {
  keymaps: [],
  properties: {
    complete: '',
    smoothscroll: false,
    hintchars: '',
  },
};

export default function reducer(
  state: State = defaultState,
  action: actions.SettingAction,
): State {
  switch (action.type) {
  case actions.SETTING_SET:
    return {
      keymaps: Object.entries(action.settings.keymaps).map((entry) => {
        return {
          key: keyUtils.fromMapKeys(entry[0]),
          op: entry[1],
        };
      }),
      properties: action.settings.properties,
    };
  default:
    return state;
  }
}

