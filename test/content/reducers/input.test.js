import { expect } from "chai";
import actions from 'content/actions';
import inputReducer from 'content/reducers/input';

describe("input reducer", () => {
  it('return the initial state', () => {
    let state = inputReducer(undefined, {});
    expect(state).to.have.deep.property('keys', []);
  });

  it('return next state for INPUT_KEY_PRESS', () => {
    let action = { type: actions.INPUT_KEY_PRESS, key: 'a' };
    let state = inputReducer(undefined, action);
    expect(state).to.have.deep.property('keys', ['a']);

    action = { type: actions.INPUT_KEY_PRESS, key: 'b' };
    state = inputReducer(state, action);
    expect(state).to.have.deep.property('keys', ['a', 'b']);
  });

  it('return next state for INPUT_CLEAR_KEYS', () => {
    let action = { type: actions.INPUT_CLEAR_KEYS };
    let state = inputReducer({ keys: [1, 2, 3] }, action);
    expect(state).to.have.deep.property('keys', []);
  });
});
