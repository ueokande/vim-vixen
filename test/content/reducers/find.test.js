import { expect } from "chai";
import actions from 'content/actions';
import findReducer from 'content/reducers/find';

describe("find reducer", () => {
  it('return the initial state', () => {
    let state = findReducer(undefined, {});
    expect(state).to.have.property('keyword', '');
    expect(state).to.have.property('found', false);
  });

  it('return next state for FIND_SET_KEYWORD', () => {
    let action = {
      type: actions.FIND_SET_KEYWORD,
      keyword: 'xyz',
      found: true,
    };
    let state = findReducer({}, action);

    expect(state.keyword).is.equal('xyz');
    expect(state.found).to.be.true;
  });
});
