import settingReducer from './setting';
import findReducer from './find';
import tabReducer from './tab';

// Make setting reducer instead of re-use
const defaultState = {
  setting: settingReducer(undefined, {}),
  find: findReducer(undefined, {}),
  tab: tabReducer(undefined, {}),
};

export default function reducer(state = defaultState, action = {}) {
  return { ...state,
    setting: settingReducer(state.setting, action),
    find: findReducer(state.find, action),
    tab: tabReducer(state.tab, action), };
}
