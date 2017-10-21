import { expect } from "chai";
import actions from 'content/actions';
import * as addonActions from 'content/actions/addon';

describe("addon actions", () => {
  describe("enable", () => {
    it('create ADDON_ENABLE action', () => {
      let action = addonActions.enable();
      expect(action.type).to.equal(actions.ADDON_ENABLE);
    });
  });

  describe("disable", () => {
    it('create ADDON_DISABLE action', () => {
      let action = addonActions.disable();
      expect(action.type).to.equal(actions.ADDON_DISABLE);
    });
  });

  describe("toggle", () => {
    it('create ADDON_TOGGLE_ENABLED action', () => {
      let action = addonActions.toggleEnabled();
      expect(action.type).to.equal(actions.ADDON_TOGGLE_ENABLED);
    });
  });
});
