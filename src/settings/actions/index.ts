// Settings
export const SETTING_SET_SETTINGS = 'setting.set.settings';
export const SETTING_SHOW_ERROR = 'setting.show.error';
export const SETTING_SWITCH_TO_FORM = 'setting.switch.to.form';
export const SETTING_SWITCH_TO_JSON = 'setting.switch.to.json';

interface SettingSetSettingsAcion {
  type: typeof SETTING_SET_SETTINGS;
  source: string;
  json: string;
  form: any;
}

interface SettingShowErrorAction {
  type: typeof SETTING_SHOW_ERROR;
  error: string;
  json: string;
}

interface SettingSwitchToFormAction {
  type: typeof SETTING_SWITCH_TO_FORM;
  form: any;
}

interface SettingSwitchToJsonAction {
  type: typeof SETTING_SWITCH_TO_JSON;
  json: string;
}

export type SettingAction =
  SettingSetSettingsAcion | SettingShowErrorAction |
  SettingSwitchToFormAction | SettingSwitchToJsonAction;
