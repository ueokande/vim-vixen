import inputReducer from '../reducers/input';

const defaultState = {
  input: inputReducer(undefined, {})
};

export default function reducer(state = defaultState, action = {}) {
  return Object.assign({}, state, {
    input: inputReducer(state.input, action)
  });
}
