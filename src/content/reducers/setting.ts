import * as actions from '../actions';
import * as keyUtils from '../../shared/utils/keys';
import * as operations from '../../shared/operations';
import { Search, Properties, DefaultSetting } from '../../shared/Settings';

export interface State {
  keymaps: { key: keyUtils.Key[], op: operations.Operation }[];
  search: Search;
  properties: Properties;
}

// defaultState does not refer due to the state is load from
// background on load.
const defaultState: State = {
  keymaps: [],
  search: DefaultSetting.search,
  properties: DefaultSetting.properties,
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
      search: action.settings.search,
    };
  default:
    return state;
  }
}

