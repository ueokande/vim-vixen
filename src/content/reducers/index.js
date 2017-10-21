import addonReducer from './addon';
import inputReducer from './input';
import followReducer from './follow';

// Make setting reducer instead of re-use
const defaultState = {
  addon: addonReducer(undefined, {}),
  input: inputReducer(undefined, {}),
  follow: followReducer(undefined, {}),
};

export default function reducer(state = defaultState, action = {}) {
  return Object.assign({}, state, {
    addon: addonReducer(state.addon, action),
    input: inputReducer(state.input, action),
    follow: followReducer(state.follow, action),
  });
}
