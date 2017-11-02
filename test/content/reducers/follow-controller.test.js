import { expect } from "chai";
import actions from 'content/actions';
import followControllerReducer from 'content/reducers/follow-controller';

describe('follow-controller reducer', () => {
  it ('returns the initial state', () => {
    let state = followControllerReducer(undefined, {});
    expect(state).to.have.property('enabled', false);
    expect(state).to.have.property('newTab');
    expect(state).to.have.deep.property('keys', '');
  });

  it ('returns next state for FOLLOW_CONTROLLER_ENABLE', () => {
    let action = { type: actions.FOLLOW_CONTROLLER_ENABLE, newTab: true };
    let state = followControllerReducer({ enabled: false, newTab: false }, action);
    expect(state).to.have.property('enabled', true);
    expect(state).to.have.property('newTab', true);
    expect(state).to.have.property('keys', '');
  });

  it ('returns next state for FOLLOW_CONTROLLER_DISABLE', () => {
    let action = { type: actions.FOLLOW_CONTROLLER_DISABLE };
    let state = followControllerReducer({ enabled: true }, action);
    expect(state).to.have.property('enabled', false);
  });

  it ('returns next state for FOLLOW_CONTROLLER_KEY_PRESS', () => {
    let action = { type: actions.FOLLOW_CONTROLLER_KEY_PRESS, key: 'a'};
    let state = followControllerReducer({ keys: '' }, action);
    expect(state).to.have.deep.property('keys', 'a');

    action = { type: actions.FOLLOW_CONTROLLER_KEY_PRESS, key: 'b'};
    state = followControllerReducer(state, action);
    expect(state).to.have.deep.property('keys', 'ab');
  });

  it ('returns next state for FOLLOW_CONTROLLER_BACKSPACE', () => {
    let action = { type: actions.FOLLOW_CONTROLLER_BACKSPACE };
    let state = followControllerReducer({ keys: 'ab' }, action);
    expect(state).to.have.deep.property('keys', 'a');

    state = followControllerReducer(state, action);
    expect(state).to.have.deep.property('keys', '');

    state = followControllerReducer(state, action);
    expect(state).to.have.deep.property('keys', '');
  });
});
