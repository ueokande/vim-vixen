import { expect } from "chai";
import actions from 'settings/actions';
import settingReducer from 'settings/reducers/setting';

describe("setting reducer", () => {
  it('return the initial state', () => {
    let state = settingReducer(undefined, {});
    expect(state).to.have.deep.property('json', '');
    expect(state).to.have.deep.property('value', {});
  });

  it('return next state for SETTING_SET_SETTINGS', () => {
    let action = {
      type: actions.SETTING_SET_SETTINGS,
      json: '{ "key": "value" }',
      value: { key: 123 },
    };
    let state = settingReducer(undefined, action);
    expect(state).to.have.deep.property('json', '{ "key": "value" }');
    expect(state).to.have.deep.property('value', { key: 123 });
  });
});
