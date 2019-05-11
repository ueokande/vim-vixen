import * as actions from './index';
import * as storages from '../storage';
import SettingData, {
  JSONSettings, FormSettings, SettingSource,
} from '../../shared/SettingData';

const load = async(): Promise<actions.SettingAction> => {
  let data = await storages.load();
  return set(data);
};

const save = async(data: SettingData): Promise<actions.SettingAction> => {
  try {
    if (data.getSource() === SettingSource.JSON) {
      // toSettings exercise validation
      data.toSettings();
    }
  } catch (e) {
    return {
      type: actions.SETTING_SHOW_ERROR,
      error: e.toString(),
      json: data.getJSON(),
    };
  }
  await storages.save(data);
  return set(data);
};

const switchToForm = (json: JSONSettings): actions.SettingAction => {
  try {
    // toSettings exercise validation
    let form = FormSettings.fromSettings(json.toSettings());
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

const switchToJson = (form: FormSettings): actions.SettingAction => {
  let json = JSONSettings.fromSettings(form.toSettings());
  return {
    type: actions.SETTING_SWITCH_TO_JSON,
    json,
  };
};

const set = (data: SettingData): actions.SettingAction => {
  let source = data.getSource();
  switch (source) {
  case SettingSource.JSON:
    return {
      type: actions.SETTING_SET_SETTINGS,
      source: source,
      json: data.getJSON(),
    };
  case SettingSource.Form:
    return {
      type: actions.SETTING_SET_SETTINGS,
      source: source,
      form: data.getForm(),
    };
  }
  throw new Error(`unknown source: ${source}`);
};

export { load, save, set, switchToForm, switchToJson };
