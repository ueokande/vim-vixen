import { expect } from "chai";
import actions from 'content/actions';
import findReducer from 'content/reducers/find';

describe("find reducer", () => {
  it('return the initial state', () => {
    let state = findReducer(undefined, {});
    expect(state).to.have.property('enabled', false);
    expect(state).to.have.property('keyword', '');
  });

  it('return next state for FIND_SHOW', () => {
    let action = { type: actions.FIND_SHOW };
    let prev = { enabled: false };
    let state = findReducer(prev, action);

    expect(state.enabled).is.equal(true);
  });

  it('return next state for FIND_HIDE', () => {
    let action = { type: actions.FIND_HIDE };
    let prev = { enabled: true };
    let state = findReducer(prev, action);

    expect(state.enabled).is.equal(false);
  });

  it('return next state for FIND_SET_KEYWORD', () => {
    let action = { type: actions.FIND_SET_KEYWORD, keyword: 'my-search' };
    let state = { enabled: true, keyword: '' };

    state = findReducer(state, action);

    expect(state.keyword).is.equal('my-search');
  });
});
