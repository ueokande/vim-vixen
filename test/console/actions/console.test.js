import { expect } from "chai";
import actions from 'console/actions';
import * as consoleActions from 'console/actions/console';

describe("console actions", () => {
  describe("showCommand", () => {
    it('create CONSOLE_SHOW_COMMAND action', () => {
      let action = consoleActions.showCommand('hello');
      expect(action.type).to.equal(actions.CONSOLE_SHOW_COMMAND);
      expect(action.text).to.equal('hello');
    });
  });

  describe("showFind", () => {
    it('create CONSOLE_SHOW_FIND action', () => {
      let action = consoleActions.showFind();
      expect(action.type).to.equal(actions.CONSOLE_SHOW_FIND);
    });
  });

  describe("showInfo", () => {
    it('create CONSOLE_SHOW_INFO action', () => {
      let action = consoleActions.showInfo('an info');
      expect(action.type).to.equal(actions.CONSOLE_SHOW_INFO);
      expect(action.text).to.equal('an info');
    });
  });

  describe("showError", () => {
    it('create CONSOLE_SHOW_ERROR action', () => {
      let action = consoleActions.showError('an error');
      expect(action.type).to.equal(actions.CONSOLE_SHOW_ERROR);
      expect(action.text).to.equal('an error');
    });
  });

  describe("hideCommand", () => {
    it('create CONSOLE_HIDE_COMMAND action', () => {
      let action = consoleActions.hideCommand();
      expect(action.type).to.equal(actions.CONSOLE_HIDE_COMMAND);
    });
  });

  describe('setConsoleText', () => {
    it('create CONSOLE_SET_CONSOLE_TEXT action', () => {
      let action = consoleActions.setConsoleText('hello world');
      expect(action.type).to.equal(actions.CONSOLE_SET_CONSOLE_TEXT);
      expect(action.consoleText).to.equal('hello world');
    });
  });

  describe("setCompletions", () => {
    it('create CONSOLE_SET_COMPLETIONS action', () => {
      let action = consoleActions.setCompletions('query', [1, 2, 3]);
      expect(action.type).to.equal(actions.CONSOLE_SET_COMPLETIONS);
      expect(action.completionSource).to.deep.equal('query');
      expect(action.completions).to.deep.equal([1, 2, 3]);
    });
  });

  describe("completionPrev", () => {
    it('create CONSOLE_COMPLETION_PREV action', () => {
      let action = consoleActions.completionPrev();
      expect(action.type).to.equal(actions.CONSOLE_COMPLETION_PREV);
    });
  });

  describe("completionNext", () => {
    it('create CONSOLE_COMPLETION_NEXT action', () => {
      let action = consoleActions.completionNext();
      expect(action.type).to.equal(actions.CONSOLE_COMPLETION_NEXT);
    });
  });
});
