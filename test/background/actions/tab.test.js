import actions from 'background/actions';
import * as tabActions from 'background/actions/tab';

describe("tab actions", () => {
  describe("selected", () => {
    it('create TAB_SELECTED action', () => {
      let action = tabActions.selected(123);
      expect(action.type).to.equal(actions.TAB_SELECTED);
      expect(action.tabId).to.equal(123);
    });
  });
});

