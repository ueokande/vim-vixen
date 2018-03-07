import settingReducer from './setting';
import findReducer from './find';

// Make setting reducer instead of re-use
const defaultState = {
  setting: settingReducer(undefined, {}),
  find: findReducer(undefined, {}),
};

export default function reducer(state = defaultState, action = {}) {
  return Object.assign({}, state, {
    setting: settingReducer(state.setting, action),
    find: findReducer(state.find, action),
  });
}
