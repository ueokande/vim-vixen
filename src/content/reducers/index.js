import inputReducer from './input';
import followReducer from './follow';

// Make setting reducer instead of re-use
const defaultState = {
  input: inputReducer(undefined, {}),
  follow: followReducer(undefined, {}),
};

export default function reducer(state = defaultState, action = {}) {
  return Object.assign({}, state, {
    input: inputReducer(state.input, action),
    follow: followReducer(state.follow, action),
  });
}
