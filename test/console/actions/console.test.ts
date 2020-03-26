import * as actions from '../../../src/console/actions';
import * as consoleActions from '../../../src/console/actions/console';
import { expect } from 'chai';

describe("console actions", () => {
  describe('hide', () => {
    it('create CONSOLE_HIDE action', () => {
      const action = consoleActions.hide();
      expect(action.type).to.equal(actions.CONSOLE_HIDE);
    });
  });
  describe("showCommand", () => {
    it('create CONSOLE_SHOW_COMMAND action', async () => {
      const action = await consoleActions.showCommand('hello');
      expect(action.type).to.equal(actions.CONSOLE_SHOW_COMMAND);
      expect(action.text).to.equal('hello');
    });
  });

  describe("showFind", () => {
    it('create CONSOLE_SHOW_FIND action', () => {
      const action = consoleActions.showFind();
      expect(action.type).to.equal(actions.CONSOLE_SHOW_FIND);
    });
  });

  describe("showError", () => {
    it('create CONSOLE_SHOW_ERROR action', () => {
      const action = consoleActions.showError('an error');
      expect(action.type).to.equal(actions.CONSOLE_SHOW_ERROR);
      expect(action.text).to.equal('an error');
    });
  });

  describe("showInfo", () => {
    it('create CONSOLE_SHOW_INFO action', () => {
      const action = consoleActions.showInfo('an info');
      expect(action.type).to.equal(actions.CONSOLE_SHOW_INFO);
      expect(action.text).to.equal('an info');
    });
  });

  describe("hideCommand", () => {
    it('create CONSOLE_HIDE_COMMAND action', () => {
      const action = consoleActions.hideCommand();
      expect(action.type).to.equal(actions.CONSOLE_HIDE_COMMAND);
    });
  });

  describe('setConsoleText', () => {
    it('create CONSOLE_SET_CONSOLE_TEXT action', () => {
      const action = consoleActions.setConsoleText('hello world');
      expect(action.type).to.equal(actions.CONSOLE_SET_CONSOLE_TEXT);
      expect(action.consoleText).to.equal('hello world');
    });
  });

  describe("completionPrev", () => {
    it('create CONSOLE_COMPLETION_PREV action', () => {
      const action = consoleActions.completionPrev();
      expect(action.type).to.equal(actions.CONSOLE_COMPLETION_PREV);
    });
  });

  describe("completionNext", () => {
    it('create CONSOLE_COMPLETION_NEXT action', () => {
      const action = consoleActions.completionNext();
      expect(action.type).to.equal(actions.CONSOLE_COMPLETION_NEXT);
    });
  });
});
