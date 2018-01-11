import { expect } from "chai";
import actions from 'background/actions';
import settingReducer from 'background/reducers/setting';

describe("setting reducer", () => {
  it('return the initial state', () => {
    let state = settingReducer(undefined, {});
    expect(state).to.have.deep.property('value', {});
  });

  it('return next state for SETTING_SET_SETTINGS', () => {
    let action = {
      type: actions.SETTING_SET_SETTINGS,
      value: { key: 123 },
    };
    let state = settingReducer(undefined, action);
    expect(state).to.have.deep.property('value', { key: 123 });
  });

  it('return next state for SETTING_SET_PROPERTY', () => {
    let state = {
      value: {
        properties: { smoothscroll: true }
      }
    }
    let action = {
      type: actions.SETTING_SET_PROPERTY,
      name: 'encoding',
      value: 'utf-8',
    };
    state = settingReducer(state, action);

    console.log(state);
    expect(state.value.properties).to.have.property('smoothscroll', true);
    expect(state.value.properties).to.have.property('encoding', 'utf-8');
  });
});
