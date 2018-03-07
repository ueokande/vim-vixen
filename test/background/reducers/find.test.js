import { expect } from "chai";
import actions from 'background/actions';
import findReducer from 'background/reducers/find';

describe("find reducer", () => {
  it('return the initial state', () => {
    let state = findReducer(undefined, {});
    expect(state).to.have.deep.property('keyword', null);
  });

  it('return next state for FIND_SET_KEYWORD', () => {
    let action = {
      type: actions.FIND_SET_KEYWORD,
      keyword: 'cherry',
    };
    let state = findReducer(undefined, action);
    expect(state).to.have.deep.property('keyword', 'cherry')
  });
});
