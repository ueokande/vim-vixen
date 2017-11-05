import { expect } from "chai";
import actions from 'content/actions';
import settingReducer from 'content/reducers/setting';

describe("content setting reducer", () => {
  it('return the initial state', () => {
    let state = settingReducer(undefined, {});
    expect(state.keymaps).to.be.empty;
  });

  it('return next state for SETTING_SET', () => {
    let newSettings = { red: 'apple', yellow: 'banana' };
    let action = { type: actions.SETTING_SET, value: newSettings };
    let state = settingReducer(undefined, action);
    expect(state).to.deep.equal(newSettings);
    expect(state).not.to.equal(newSettings);  // assert deep copy
  });
});
