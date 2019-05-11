import * as actions from 'content/actions';
import * as settingActions from 'content/actions/setting';

describe("setting actions", () => {
  describe("set", () => {
    it('create SETTING_SET action', () => {
      let action = settingActions.set({
        keymaps: {
          'dd': 'remove current tab',
          'z<C-A>': 'increment',
        },
        search: {
          default: "google",
          engines: {
            google: 'https://google.com/search?q={}',
          }
        },
        properties: {
          hintchars: 'abcd1234',
        },
        blacklist: [],
      });
      expect(action.type).to.equal(actions.SETTING_SET);
      expect(action.settings.properties.hintchars).to.equal('abcd1234');
    });

    it('overrides cancel keys', () => {
      let action = settingActions.set({
        keymaps: {
          "k": { "type": "scroll.vertically", "count": -1 },
          "j": { "type": "scroll.vertically", "count": 1 },
        }
      });
      let keymaps = action.settings.keymaps;
      expect(action.settings.keymaps).to.deep.equals({
        "k": { type: "scroll.vertically", count: -1 },
        "j": { type: "scroll.vertically", count: 1 },
        '<Esc>': { type: 'cancel' },
        '<C-[>': { type: 'cancel' },
      });
    });
  });
});
