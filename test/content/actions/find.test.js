import { expect } from "chai";
import actions from 'content/actions';
import * as findActions from 'content/actions/find';

describe("find actions", () => {
  describe("show", () => {
    it('create FIND_SHOW action', () => {
      let action = findActions.show();
      expect(action.type).to.equal(actions.FIND_SHOW);
    });
  });

  describe("hide", () => {
    it('create FIND_HIDE action', () => {
      let action = findActions.hide();
      expect(action.type).to.equal(actions.FIND_HIDE);
    });
  });
});
