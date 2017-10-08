import settingReducer from 'settings/reducers/setting';
import inputReducer from './input';
import followReducer from './follow';

// Make setting reducer instead of re-use
const defaultState = {
  input: inputReducer(undefined, {}),
  setting: settingReducer(undefined, {}),
  follow: followReducer(undefined, {}),
};

export default function reducer(state = defaultState, action = {}) {
  return Object.assign({}, state, {
    input: inputReducer(state.input, action),
    setting: settingReducer(state.setting, action),
    follow: followReducer(state.follow, action),
  });
}
