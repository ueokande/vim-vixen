import actions from 'background/actions';
import tabReducer from 'background/reducers/tab';

describe("tab reducer", () => {
  it('return the initial state', () => {
    let state = tabReducer(undefined, {});
    expect(state.previousSelected).to.equal(-1);
    expect(state.currentSelected).to.equal(-1);
  });

  it('return next state for TAB_SELECTED', () => {
    let state = undefined;

    state = tabReducer(state, { type: actions.TAB_SELECTED, tabId: 123 });
    expect(state.previousSelected).to.equal(-1);
    expect(state.currentSelected).to.equal(123);

    state = tabReducer(state, { type: actions.TAB_SELECTED, tabId: 456 });
    expect(state.previousSelected).to.equal(123);
    expect(state.currentSelected).to.equal(456);
  });
});
