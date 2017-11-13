import { expect } from "chai";
import actions from 'content/actions';
import * as settingActions from 'content/actions/setting';

describe("setting actions", () => {
  describe("set", () => {
    it('create SETTING_SET action', () => {
      let action = settingActions.set({ red: 'apple', yellow: 'banana' });
      expect(action.type).to.equal(actions.SETTING_SET);
      expect(action.value.red).to.equal('apple');
      expect(action.value.yellow).to.equal('banana');
      expect(action.value.keymaps).to.be.empty;
    });

    it('converts keymaps', () => {
      let action = settingActions.set({
        keymaps: {
          'dd': 'remove current tab',
          'z<C-A>': 'increment',
        }
      });
      let keymaps = action.value.keymaps;
      let map = new Map(keymaps);
      expect(map).to.have.deep.all.keys(
        [
          [{ key: 'd', shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
           { key: 'd', shiftKey: false, ctrlKey: false, altKey: false, metaKey: false }],
          [{ key: 'z', shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
           { key: 'a', shiftKey: false, ctrlKey: true, altKey: false, metaKey: false }],
        ]
      );
    });
  });
});
