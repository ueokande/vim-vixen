import { expect } from "chai";
import actions from 'content/actions';
import * as followControllerActions from 'content/actions/follow-controller';

describe('follow-controller actions', () => {
  describe('enable', () => {
    it('creates FOLLOW_CONTROLLER_ENABLE action', () => {
      let action = followControllerActions.enable(true);
      expect(action.type).to.equal(actions.FOLLOW_CONTROLLER_ENABLE);
      expect(action.newTab).to.equal(true);
    });
  });

  describe('disable', () => {
    it('creates FOLLOW_CONTROLLER_DISABLE action', () => {
      let action = followControllerActions.disable(true);
      expect(action.type).to.equal(actions.FOLLOW_CONTROLLER_DISABLE);
    });
  });

  describe('keyPress', () => {
    it('creates FOLLOW_CONTROLLER_KEY_PRESS action', () => {
      let action = followControllerActions.keyPress(100);
      expect(action.type).to.equal(actions.FOLLOW_CONTROLLER_KEY_PRESS);
      expect(action.key).to.equal(100);
    });
  });

  describe('backspace', () => {
    it('creates FOLLOW_CONTROLLER_BACKSPACE action', () => {
      let action = followControllerActions.backspace(100);
      expect(action.type).to.equal(actions.FOLLOW_CONTROLLER_BACKSPACE);
    });
  });
});
