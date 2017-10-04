import inputReducer from '../reducers/input';
import consoleReducer from '../reducers/console';
import settingReducer from '../reducers/setting';
import followReducer from '../reducers/follow';
import completionReducer from '../reducers/completion';

const defaultState = {
  input: inputReducer(undefined, {}),
  console: consoleReducer(undefined, {}),
  setting: settingReducer(undefined, {}),
  follow: followReducer(undefined, {}),
  completion: completionReducer(undefined, {}),
};

export default function reducer(state = defaultState, action = {}) {
  return Object.assign({}, state, {
    input: inputReducer(state.input, action),
    console: consoleReducer(state.console, action),
    setting: settingReducer(state.setting, action),
    follow: followReducer(state.follow, action),
    completion: completionReducer(state.completion, action),
  });
}
