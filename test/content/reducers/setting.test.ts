import * as actions from 'content/actions';
import settingReducer from 'content/reducers/setting';

describe("content setting reducer", () => {
  it('return the initial state', () => {
    let state = settingReducer(undefined, {});
    expect(state.keymaps).to.be.empty;
  });

  it('return next state for SETTING_SET', () => {
    let newSettings = { red: 'apple', yellow: 'banana' };
    let action = {
      type: actions.SETTING_SET,
      settings: {
        keymaps: {
          "zz": { type: "zoom.neutral" },
          "<S-Esc>": { "type": "addon.toggle.enabled" }
        },
        "blacklist": []
      }
    }
    let state = settingReducer(undefined, action);
    expect(state.keymaps).to.have.deep.all.members([
      { key: [{ key: 'z', shiftKey: false, ctrlKey: false, altKey: false, metaKey: false },
              { key: 'z', shiftKey: false, ctrlKey: false, altKey: false, metaKey: false }],
        op: { type: 'zoom.neutral' }},
      { key: [{ key: 'Esc', shiftKey: true, ctrlKey: false, altKey: false, metaKey: false }],
        op: { type: 'addon.toggle.enabled' }},
    ]);
  });
});
