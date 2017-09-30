import { expect } from "chai";
import actions from '../../src/actions';
import completionReducer from '../../src/reducers/completion';

describe("completion reducer", () => {
  it ('return the initial state', () => {
    let state = completionReducer(undefined, {});
    expect(state).to.have.property('groupSelection', -1);
    expect(state).to.have.property('itemSelection', -1);
    expect(state).to.have.deep.property('groups', []);
  });

  it ('return next state for COMPLETION_SET_ITEMS', () => {
    let state = {
      groupSelection: 0,
      itemSelection: 0,
      groups: [],
    }
    let action = {
      type: actions.COMPLETION_SET_ITEMS,
      groups: [{
        name: 'Apple',
        items: [1, 2, 3]
      }, {
        name: 'Banana',
        items: [4, 5, 6]
      }]
    }
    state = completionReducer(state, action);
    expect(state).to.have.property('groups', action.groups);
    expect(state).to.have.property('groupSelection', -1);
    expect(state).to.have.property('itemSelection', -1);
  });

  it ('return next state for COMPLETION_SELECT_NEXT', () => {
    let action = { type: actions.COMPLETION_SELECT_NEXT };
    let state = {
      groupSelection: -1,
      itemSelection: -1,
      groups: [{
        name: 'Apple',
        items: [1, 2]
      }, {
        name: 'Banana',
        items: [3]
      }]
    };

    state = completionReducer(state, action);
    expect(state).to.have.property('groupSelection', 0);
    expect(state).to.have.property('itemSelection', 0);

    state = completionReducer(state, action);
    expect(state).to.have.property('groupSelection', 0);
    expect(state).to.have.property('itemSelection', 1);

    state = completionReducer(state, action);
    state = completionReducer(state, action);
    expect(state).to.have.property('groupSelection', -1);
    expect(state).to.have.property('itemSelection', -1);
  });

  it ('return next state for COMPLETION_SELECT_PREV', () => {
    let action = { type: actions.COMPLETION_SELECT_PREV };
    let state = {
      groupSelection: -1,
      itemSelection: -1,
      groups: [{
        name: 'Apple',
        items: [1, 2]
      }, {
        name: 'Banana',
        items: [3]
      }]
    };

    state = completionReducer(state, action);
    expect(state).to.have.property('groupSelection', 1);
    expect(state).to.have.property('itemSelection', 0);

    state = completionReducer(state, action);
    expect(state).to.have.property('groupSelection', 0);
    expect(state).to.have.property('itemSelection', 1);

    state = completionReducer(state, action);
    state = completionReducer(state, action);
    expect(state).to.have.property('groupSelection', -1);
    expect(state).to.have.property('itemSelection', -1);
  });
});
