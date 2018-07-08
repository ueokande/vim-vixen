import actions from 'settings/actions';
import settingReducer from 'settings/reducers/setting';

describe("settings setting reducer", () => {
  it('return the initial state', () => {
    let state = settingReducer(undefined, {});
    expect(state).to.have.deep.property('json', '');
    expect(state).to.have.deep.property('form', null);
    expect(state).to.have.deep.property('error', '');
  });

  it('return next state for SETTING_SET_SETTINGS', () => {
    let action = {
      type: actions.SETTING_SET_SETTINGS,
      source: 'json',
      json: '{ "key": "value" }',
      form: {},
    };
    let state = settingReducer(undefined, action);
    expect(state).to.have.deep.property('source', 'json');
    expect(state).to.have.deep.property('json', '{ "key": "value" }');
    expect(state).to.have.deep.property('form', {});
  });

  it('return next state for SETTING_SHOW_ERROR', () => {
    let action = {
      type: actions.SETTING_SHOW_ERROR,
      text: 'bad value',
      json: '{}',
    };
    let state = settingReducer(undefined, action);
    expect(state).to.have.deep.property('error', 'bad value');
    expect(state).to.have.deep.property('json', '{}');
  });

  it('return next state for SETTING_SWITCH_TO_FORM', () => {
    let action = {
      type: actions.SETTING_SWITCH_TO_FORM,
      form: {},
    };
    let state = settingReducer(undefined, action);
    expect(state).to.have.deep.property('form', {});
    expect(state).to.have.deep.property('source', 'form');
  });

  it('return next state for SETTING_SWITCH_TO_JSON', () => {
    let action = {
      type: actions.SETTING_SWITCH_TO_JSON,
      json: '{}',
    };
    let state = settingReducer(undefined, action);
    expect(state).to.have.deep.property('json', '{}');
    expect(state).to.have.deep.property('source', 'json');
  });
});
