import { expect } from "chai";
import actions from '../../src/actions';
import * as inputActions from '../../src/actions/input';

describe("input actions", () => {
  describe("keyPress", () => {
    it('create INPUT_KEY_PRESS action', () => {
      let action = inputActions.keyPress(123, true);
      expect(action.type).to.equal(actions.INPUT_KEY_PRESS);
      expect(action.code).to.equal(123);
      expect(action.ctrl).to.be.true;
    });
  });

  describe("clearKeys", () => {
    it('create INPUT_CLEAR_KEYSaction', () => {
      let action = inputActions.clearKeys();
      expect(action.type).to.equal(actions.INPUT_CLEAR_KEYS);
    });
  });
});
