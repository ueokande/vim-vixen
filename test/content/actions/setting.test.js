import { expect } from "chai";
import actions from 'content/actions';
import * as settingActions from 'content/actions/setting';

describe("setting actions", () => {
  describe("set", () => {
    it('create SETTING_SET action', () => {
      let action = settingActions.set({ red: 'apple', yellow: 'banana' });
      expect(action.type).to.equal(actions.SETTING_SET);
      expect(action.value).to.deep.equal({ red: 'apple', yellow: 'banana' });
    });
  });
});
