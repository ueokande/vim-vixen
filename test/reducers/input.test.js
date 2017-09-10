import { expect } from "chai";
import actions from '../../src/actions';
import inputReducer from '../../src/reducers/input';

describe("input reducer", () => {
  it('return the initial state', () => {
    let state = inputReducer(undefined, {});
    expect(state).to.have.deep.property('keys', []);
  });

  it('return next state for INPUT_KEY_PRESS', () => {
    let action = { type: actions.INPUT_KEY_PRESS, code: 123, ctrl: true };
    let state = inputReducer(undefined, action);
    expect(state).to.have.deep.property('keys', [{ code: 123, ctrl: true }]);

    action = { type: actions.INPUT_KEY_PRESS, code: 456, ctrl: false };
    state = inputReducer(state, action);
    expect(state).to.have.deep.property('keys', [
      { code: 123, ctrl: true },
      { code: 456, ctrl: false }
    ]);
  });

  it('return next state for INPUT_CLEAR_KEYS', () => {
    let action = { type: actions.INPUT_CLEAR_KEYS };
    let state = inputReducer({
      keys: [
        { code: 123, ctrl: true },
        { code: 456, ctrl: false }
      ]
    }, action);
    expect(state).to.have.deep.property('keys', []);
  });
});
