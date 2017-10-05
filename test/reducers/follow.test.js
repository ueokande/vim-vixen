import { expect } from "chai";
import actions from 'actions';
import followReducer from 'reducers/follow';

describe('follow reducer', () => {
  it ('returns the initial state', () => {
    let state = followReducer(undefined, {});
    expect(state).to.have.property('enabled', false);
    expect(state).to.have.property('newTab');
    expect(state).to.have.deep.property('keys', []);
  });

  it ('returns next state for FOLLOW_ENABLE', () => {
    let action = { type: actions.FOLLOW_ENABLE, newTab: true };
    let state = followReducer({ enabled: false, newTab: false }, action);
    expect(state).to.have.property('enabled', true);
    expect(state).to.have.property('newTab', true);
  });

  it ('returns next state for FOLLOW_DISABLE', () => {
    let action = { type: actions.FOLLOW_DISABLE };
    let state = followReducer({ enabled: true }, action);
    expect(state).to.have.property('enabled', false);
  });

  it ('returns next state for FOLLOW_KEY_PRESS', () => {
    let action = { type: actions.FOLLOW_KEY_PRESS, key: 100};
    let state = followReducer({ keys: [] }, action);
    expect(state).to.have.deep.property('keys', [100]);

    action = { type: actions.FOLLOW_KEY_PRESS, key: 200};
    state = followReducer(state, action);
    expect(state).to.have.deep.property('keys', [100, 200]);
  });

  it ('returns next state for FOLLOW_BACKSPACE', () => {
    let action = { type: actions.FOLLOW_BACKSPACE };
    let state = followReducer({ keys: [100, 200] }, action);
    expect(state).to.have.deep.property('keys', [100]);

    state = followReducer(state, action);
    expect(state).to.have.deep.property('keys', []);

    state = followReducer(state, action);
    expect(state).to.have.deep.property('keys', []);
  });
});
