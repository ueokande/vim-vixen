import * as actions from 'settings/actions';
import settingReducer from 'settings/reducers/setting';

describe("settings setting reducer", () => {
  it('return the initial state', () => {
    const state = settingReducer(undefined, {});
    expect(state).to.have.deep.property('source', 'json');
    expect(state).to.have.deep.property('error', '');
  });

  it('return next state for SETTING_SET_SETTINGS', () => {
    const action = {
      type: actions.SETTING_SET_SETTINGS,
      source: 'json',
      json: '{ "key": "value" }',
      form: {},
    };
    const state = settingReducer(undefined, action);
    expect(state).to.have.deep.property('source', 'json');
    expect(state).to.have.deep.property('json', '{ "key": "value" }');
    expect(state).to.have.deep.property('form', {});
  });

  it('return next state for SETTING_SHOW_ERROR', () => {
    const action = {
      type: actions.SETTING_SHOW_ERROR,
      error: 'bad value',
      json: '{}',
    };
    const state = settingReducer(undefined, action);
    expect(state).to.have.deep.property('error', 'bad value');
    expect(state).to.have.deep.property('json', '{}');
  });

  it('return next state for SETTING_SWITCH_TO_FORM', () => {
    const action = {
      type: actions.SETTING_SWITCH_TO_FORM,
      form: {},
    };
    const state = settingReducer(undefined, action);
    expect(state).to.have.deep.property('form', {});
    expect(state).to.have.deep.property('source', 'form');
  });

  it('return next state for SETTING_SWITCH_TO_JSON', () => {
    const action = {
      type: actions.SETTING_SWITCH_TO_JSON,
      json: '{}',
    };
    const state = settingReducer(undefined, action);
    expect(state).to.have.deep.property('json', '{}');
    expect(state).to.have.deep.property('source', 'json');
  });
});
