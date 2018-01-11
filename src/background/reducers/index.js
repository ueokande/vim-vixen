import settingReducer from './setting';

// Make setting reducer instead of re-use
const defaultState = {
  setting: settingReducer(undefined, {}),
};

export default function reducer(state = defaultState, action = {}) {
  return Object.assign({}, state, {
    setting: settingReducer(state.setting, action),
  });
}
