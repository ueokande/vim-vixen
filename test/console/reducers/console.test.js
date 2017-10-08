import { expect } from "chai";
import actions from 'console/actions';
import reducer from 'console/reducers';

describe("console reducer", () => {
  it('return the initial state', () => {
    let state = reducer(undefined, {});
    expect(state).to.have.property('errorShown', false);
    expect(state).to.have.property('errorText', '');
    expect(state).to.have.property('commandShown', false);
    expect(state).to.have.property('commandText', '');
    expect(state).to.have.deep.property('completions', []);
    expect(state).to.have.property('groupSelection', -1);
    expect(state).to.have.property('itemSelection', -1);
  });

  it('return next state for CONSOLE_SHOW_COMMAND', () => {
    let action = { type: actions.CONSOLE_SHOW_COMMAND, text: 'open ' };
    let state = reducer({}, action);
    expect(state).to.have.property('commandShown', true);
    expect(state).to.have.property('commandText', 'open ');
    expect(state).to.have.property('errorShown', false);
  });

  it('return next state for CONSOLE_SHOW_ERROR', () => {
    let action = { type: actions.CONSOLE_SHOW_ERROR, text: 'an error' };
    let state = reducer({}, action);
    expect(state).to.have.property('errorShown', true);
    expect(state).to.have.property('errorText', 'an error');
    expect(state).to.have.property('commandShown', false);
  });

  it('return next state for CONSOLE_HIDE', () => {
    let action = { type: actions.CONSOLE_HIDE };
    let state = reducer({}, action);
    expect(state).to.have.property('errorShown', false);
    expect(state).to.have.property('commandShown', false);
  });

  it ('return next state for CONSOLE_SET_COMPLETIONS', () => {
    let state = {
      groupSelection: 0,
      itemSelection: 0,
      completions: [],
    }
    let action = {
      type: actions.CONSOLE_SET_COMPLETIONS,
      completions: [{
        name: 'Apple',
        items: [1, 2, 3]
      }, {
        name: 'Banana',
        items: [4, 5, 6]
      }]
    }
    state = reducer(state, action);
    expect(state).to.have.property('completions', action.completions);
    expect(state).to.have.property('groupSelection', -1);
    expect(state).to.have.property('itemSelection', -1);
  });

  it ('return next state for CONSOLE_COMPLETION_NEXT', () => {
    let action = { type: actions.CONSOLE_COMPLETION_NEXT };
    let state = {
      groupSelection: -1,
      itemSelection: -1,
      completions: [{
        name: 'Apple',
        items: [1, 2]
      }, {
        name: 'Banana',
        items: [3]
      }]
    };

    state = reducer(state, action);
    expect(state).to.have.property('groupSelection', 0);
    expect(state).to.have.property('itemSelection', 0);

    state = reducer(state, action);
    expect(state).to.have.property('groupSelection', 0);
    expect(state).to.have.property('itemSelection', 1);

    state = reducer(state, action);
    state = reducer(state, action);
    expect(state).to.have.property('groupSelection', -1);
    expect(state).to.have.property('itemSelection', -1);
  });

  it ('return next state for CONSOLE_COMPLETION_PREV', () => {
    let action = { type: actions.CONSOLE_COMPLETION_PREV };
    let state = {
      groupSelection: -1,
      itemSelection: -1,
      completions: [{
        name: 'Apple',
        items: [1, 2]
      }, {
        name: 'Banana',
        items: [3]
      }]
    };

    state = reducer(state, action);
    expect(state).to.have.property('groupSelection', 1);
    expect(state).to.have.property('itemSelection', 0);

    state = reducer(state, action);
    expect(state).to.have.property('groupSelection', 0);
    expect(state).to.have.property('itemSelection', 1);

    state = reducer(state, action);
    state = reducer(state, action);
    expect(state).to.have.property('groupSelection', -1);
    expect(state).to.have.property('itemSelection', -1);
  });

});
