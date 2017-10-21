import { expect } from "chai";
import actions from 'content/actions';
import * as inputActions from 'content/actions/input';

describe("input actions", () => {
  describe("keyPress", () => {
    it('create INPUT_KEY_PRESS action', () => {
      let action = inputActions.keyPress('a');
      expect(action.type).to.equal(actions.INPUT_KEY_PRESS);
      expect(action.key).to.equal('a');
    });
  });

  describe("clearKeys", () => {
    it('create INPUT_CLEAR_KEYSaction', () => {
      let action = inputActions.clearKeys();
      expect(action.type).to.equal(actions.INPUT_CLEAR_KEYS);
    });
  });
});
