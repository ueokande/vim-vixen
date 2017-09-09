import { expect } from "chai";
import actions from '../../src/actions';
import consoleReducer from '../../src/reducers/console';

describe("console reducer", () => {
  it('return the initial state', () => {
    let state = consoleReducer(undefined, {});
    expect(state).to.have.property('errorShown', false);
    expect(state).to.have.property('errorText', '');
    expect(state).to.have.property('commandShown', false);
    expect(state).to.have.property('commandText', '');
    expect(state).to.have.deep.property('completions', []);
  });

  it('return next state for CONSOLE_SHOW_COMMAND', () => {
    let action = { type: actions.CONSOLE_SHOW_COMMAND, text: 'open ' };
    let state = consoleReducer({}, action);
    expect(state).to.have.property('commandShown', true);
    expect(state).to.have.property('commandText', 'open ');
    expect(state).to.have.property('errorShown', false);
  });

  it('return next state for CONSOLE_SET_COMPLETIONS', () => {
    let action = { type: actions.CONSOLE_SET_COMPLETIONS, completions: [1, 2, 3] };
    let state = consoleReducer({}, action);
    expect(state).to.have.deep.property('completions', [1, 2, 3]);
  });

  it('return next state for CONSOLE_SHOW_ERROR', () => {
    let action = { type: actions.CONSOLE_SHOW_ERROR, text: 'an error' };
    let state = consoleReducer({}, action);
    expect(state).to.have.property('errorShown', true);
    expect(state).to.have.property('errorText', 'an error');
    expect(state).to.have.property('commandShown', false);
  });

  it('return next state for CONSOLE_HIDE', () => {
    let action = { type: actions.CONSOLE_HIDE };
    let state = consoleReducer({}, action);
    expect(state).to.have.property('errorShown', false);
    expect(state).to.have.property('commandShown', false);
  });
});
