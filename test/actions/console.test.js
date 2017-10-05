import { expect } from "chai";
import actions from 'actions';
import * as consoleActions from 'actions/console';

describe("console actions", () => {
  describe("showCommand", () => {
    it('create CONSOLE_SHOW_COMMAND action', () => {
      let action = consoleActions.showCommand('hello');
      expect(action.type).to.equal(actions.CONSOLE_SHOW_COMMAND);
      expect(action.text).to.equal('hello');
    });
  });

  describe("setCompletions", () => {
    it('create CONSOLE_SET_COMPLETIONS action', () => {
      let action = consoleActions.setCompletions([1,2,3]);
      expect(action.type).to.equal(actions.CONSOLE_SET_COMPLETIONS);
      expect(action.completions).to.deep.equal([1, 2, 3]);
    });
  });

  describe("showError", () => {
    it('create CONSOLE_SHOW_ERROR action', () => {
      let action = consoleActions.showError('an error');
      expect(action.type).to.equal(actions.CONSOLE_SHOW_ERROR);
      expect(action.text).to.equal('an error');
    });
  });

  describe("hide", () => {
    it('create CONSOLE_HIDE action', () => {
      let action = consoleActions.hide();
      expect(action.type).to.equal(actions.CONSOLE_HIDE);
    });
  });
});

