import actions from 'content/actions';
import * as markActions from 'content/actions/mark';

describe('mark actions', () => {
  describe('startSet', () => {
    it('create MARK_START_SET action', () => {
      let action = markActions.startSet();
      expect(action.type).to.equal(actions.MARK_START_SET);
    });
  });

  describe('startJump', () => {
    it('create MARK_START_JUMP action', () => {
      let action = markActions.startJump();
      expect(action.type).to.equal(actions.MARK_START_JUMP);
    });
  });

  describe('cancel', () => {
    it('create MARK_CANCEL action', () => {
      let action = markActions.cancel();
      expect(action.type).to.equal(actions.MARK_CANCEL);
    });
  });

  describe('setLocal', () => {
    it('create setLocal action', () => {
      let action = markActions.setLocal('a', 20, 30);
      expect(action.type).to.equal(actions.MARK_SET_LOCAL);
      expect(action.key).to.equal('a');
      expect(action.x).to.equal(20);
      expect(action.y).to.equal(30);
    });
  });
});
