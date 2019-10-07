import {
  JSONTextSettings, FormSettings, SettingSource,
} from '../../shared/SettingData';

// Settings
export const SETTING_SET_SETTINGS = 'setting.set.settings';
export const SETTING_SHOW_ERROR = 'setting.show.error';
export const SETTING_SWITCH_TO_FORM = 'setting.switch.to.form';
export const SETTING_SWITCH_TO_JSON = 'setting.switch.to.json';

interface SettingSetSettingsAcion {
  type: typeof SETTING_SET_SETTINGS;
  source: SettingSource;
  json?: JSONTextSettings;
  form?: FormSettings;
}

interface SettingShowErrorAction {
  type: typeof SETTING_SHOW_ERROR;
  error: string;
  json: JSONTextSettings;
}

interface SettingSwitchToFormAction {
  type: typeof SETTING_SWITCH_TO_FORM;
  form: FormSettings,
}

interface SettingSwitchToJsonAction {
  type: typeof SETTING_SWITCH_TO_JSON;
  json: JSONTextSettings,
}

export type SettingAction =
  SettingSetSettingsAcion | SettingShowErrorAction |
  SettingSwitchToFormAction | SettingSwitchToJsonAction;
