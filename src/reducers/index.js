import inputReducer from 'reducers/input';
import settingReducer from 'reducers/setting';
import followReducer from 'reducers/follow';

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
