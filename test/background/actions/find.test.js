import { expect } from "chai";
import actions from 'background/actions';
import * as findActions from 'background/actions/find';

describe("find actions", () => {
  describe("setKeyword", () => {
    it('create FIND_SET_KEYWORD action', () => {
      let action = findActions.setKeyword('banana');
      expect(action.type).to.equal(actions.FIND_SET_KEYWORD);
      expect(action.keyword).to.equal('banana');
    });
  });
});
