import { expect } from "chai";
import actions from 'content/actions';
import * as followActions from 'content/actions/follow';

describe('follow actions', () => {
  describe('enable', () => {
    it('creates FOLLOW_ENABLE action', () => {
      let action = followActions.enable(true);
      expect(action.type).to.equal(actions.FOLLOW_ENABLE);
      expect(action.newTab).to.equal(true);
    });
  });

  describe('disable', () => {
    it('creates FOLLOW_DISABLE action', () => {
      let action = followActions.disable(true);
      expect(action.type).to.equal(actions.FOLLOW_DISABLE);
    });
  });

  describe('keyPress', () => {
    it('creates FOLLOW_KEY_PRESS action', () => {
      let action = followActions.keyPress(100);
      expect(action.type).to.equal(actions.FOLLOW_KEY_PRESS);
      expect(action.key).to.equal(100);
    });
  });

  describe('backspace', () => {
    it('creates FOLLOW_BACKSPACE action', () => {
      let action = followActions.backspace(100);
      expect(action.type).to.equal(actions.FOLLOW_BACKSPACE);
    });
  });
});
