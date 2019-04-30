import DefaultSettings from './default';
import * as settingsValues from './values';

const loadRaw = async(): Promise<any> => {
  let { settings } = await browser.storage.local.get('settings');
  if (!settings) {
    return DefaultSettings;
  }
  return { ...DefaultSettings, ...settings as object };
};

const loadValue = async() => {
  let settings = await loadRaw();
  let value = JSON.parse(DefaultSettings.json);
  if (settings.source === 'json') {
    value = settingsValues.valueFromJson(settings.json);
  } else if (settings.source === 'form') {
    value = settingsValues.valueFromForm(settings.form);
  }
  if (!value.properties) {
    value.properties = {};
  }
  return { ...settingsValues.valueFromJson(DefaultSettings.json), ...value };
};

const save = (settings: any): Promise<any> => {
  return browser.storage.local.set({
    settings,
  });
};

export { loadRaw, loadValue, save };
