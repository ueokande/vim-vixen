import * as actions from 'content/actions';
import reducer from 'content/reducers/mark';

describe("mark reducer", () => {
  it('return the initial state', () => {
    let state = reducer(undefined, {});
    expect(state.setMode).to.be.false;
    expect(state.jumpMode).to.be.false;
  });

  it('starts set mode', () => {
    let action = { type: actions.MARK_START_SET };
    let state = reducer(undefined, action);
    expect(state.setMode).to.be.true;
  });

  it('starts jump mode', () => {
    let action = { type: actions.MARK_START_JUMP };
    let state = reducer(undefined, action);
    expect(state.jumpMode).to.be.true;
  });

  it('cancels set and jump mode', () => {
    let action = { type: actions.MARK_CANCEL };
    let state = reducer({ setMode: true }, action);
    expect(state.setMode).to.be.false;

    state = reducer({ jumpMode: true }, action);
    expect(state.jumpMode).to.be.false;
  });
});
