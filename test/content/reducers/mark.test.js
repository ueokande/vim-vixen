import actions from 'content/actions';
import reducer from 'content/reducers/mark';

describe("mark reducer", () => {
  it('return the initial state', () => {
    let state = reducer(undefined, {});
    expect(state.set).to.be.false;
    expect(state.jump).to.be.false;
    expect(state.marks).to.be.empty;
  });

  it('starts set mode', () => {
    let action = { type: actions.MARK_START_SET };
    let state = reducer(undefined, action);
    expect(state.set).to.be.true;
  });

  it('starts jump mode', () => {
    let action = { type: actions.MARK_START_JUMP };
    let state = reducer(undefined, action);
    expect(state.jump).to.be.true;
  });

  it('cancels set and jump mode', () => {
    let action = { type: actions.MARK_CANCEL };
    let state = reducer({ set: true }, action);
    expect(state.set).to.be.false;

    state = reducer({ jump: true }, action);
    expect(state.jump).to.be.false;
  });

  it('stores local mark', () => {
    let action = { type: actions.MARK_SET_LOCAL, key: 'a', y: 10 };
    let state = reducer(undefined, action);
    expect(state.marks['a']).to.be.an('object')
    expect(state.marks['a'].y).to.equal(10)
  });
});
