import { expect } from "chai";
import actions from 'actions';
import * as completionActions from 'actions/completion';

describe("completion actions", () => {
  describe('setItems', () => {
    it('create COMPLETION_SET_ITEMS action', () => {
      let action = completionActions.setItems([1, 2, 3]);
      expect(action.type).to.equal(actions.COMPLETION_SET_ITEMS);
      expect(action.groups).to.deep.equal([1, 2, 3]);
    });
  });

  describe('selectNext', () => {
    it('create COMPLETION_SELECT_NEXT action', () => {
      let action = completionActions.selectNext();
      expect(action.type).to.equal(actions.COMPLETION_SELECT_NEXT);
    });
  });

  describe('selectPrev', () => {
    it('create COMPLETION_SELECT_PREV action', () => {
      let action = completionActions.selectPrev();
      expect(action.type).to.equal(actions.COMPLETION_SELECT_PREV);
    });
  });
});
