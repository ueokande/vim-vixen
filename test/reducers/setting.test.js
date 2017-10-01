import { expect } from "chai";
import actions from '../../src/actions';
import settingReducer from '../../src/reducers/setting';

describe("setting reducer", () => {
  it('return the initial state', () => {
    let state = settingReducer(undefined, {});
    expect(state).to.have.deep.property('settings', {});
  });

  it('return next state for SETTING_SET_SETTINGS', () => {
    let action = {
      type: actions.SETTING_SET_SETTINGS,
      settings: { value1: 'hello', value2: 'world' },
    };
    let state = settingReducer(undefined, action);
    expect(state).to.have.deep.property('settings', {
      value1: 'hello',
      value2: 'world',
    });
  });
});
