import inputReducer from '../reducers/input';
import consoleReducer from '../reducers/console';

const defaultState = {
  input: inputReducer(undefined, {}),
  console: consoleReducer(undefined, {})
};

export default function reducer(state = defaultState, action = {}) {
  return Object.assign({}, state, {
    input: inputReducer(state.input, action),
    console: consoleReducer(state.console, action)
  });
}
