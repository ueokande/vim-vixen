import { expect } from "chai";
import actions from 'actions';
import * as inputActions from 'actions/input';

describe("input actions", () => {
  describe("keyPress", () => {
    it('create INPUT_KEY_PRESS action', () => {
      let action = inputActions.keyPress('a', false);
      expect(action.type).to.equal(actions.INPUT_KEY_PRESS);
      expect(action.key).to.equal('a');
    });

    it('create INPUT_KEY_PRESS action from key with ctrl', () => {
      let action = inputActions.keyPress('b', true);
      expect(action.type).to.equal(actions.INPUT_KEY_PRESS);
      expect(action.key).to.equal('<C-B>');
    });
  });

  describe("clearKeys", () => {
    it('create INPUT_CLEAR_KEYSaction', () => {
      let action = inputActions.clearKeys();
      expect(action.type).to.equal(actions.INPUT_CLEAR_KEYS);
    });
  });
});
