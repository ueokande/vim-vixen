import * as actions from './index';
import * as validator from '../../shared/settings/validator';
import * as settingsValues from '../../shared/settings/values';
import * as settingsStorage from '../../shared/settings/storage';
import keymaps from '../keymaps';

const load = async(): Promise<actions.SettingAction> => {
  let settings = await settingsStorage.loadRaw();
  return set(settings);
};

const save = async(settings: any): Promise<actions.SettingAction> => {
  try {
    if (settings.source === 'json') {
      let value = JSON.parse(settings.json);
      validator.validate(value);
    }
  } catch (e) {
    return {
      type: actions.SETTING_SHOW_ERROR,
      error: e.toString(),
      json: settings.json,
    };
  }
  await settingsStorage.save(settings);
  return set(settings);
};

const switchToForm = (json: string): actions.SettingAction => {
  try {
    validator.validate(JSON.parse(json));
    let form = settingsValues.formFromJson(json, keymaps.allowedOps);
    return {
      type: actions.SETTING_SWITCH_TO_FORM,
      form,
    };
  } catch (e) {
    return {
      type: actions.SETTING_SHOW_ERROR,
      error: e.toString(),
      json,
    };
  }
};

const switchToJson = (form: any): actions.SettingAction => {
  let json = settingsValues.jsonFromForm(form);
  return {
    type: actions.SETTING_SWITCH_TO_JSON,
    json,
  };
};

const set = (settings: any): actions.SettingAction => {
  return {
    type: actions.SETTING_SET_SETTINGS,
    source: settings.source,
    json: settings.json,
    form: settings.form,
  };
};

export { load, save, set, switchToForm, switchToJson };
