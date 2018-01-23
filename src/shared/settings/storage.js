import DefaultSettings from './default';
import * as settingsValues from './values';

const loadRaw = () => {
  return browser.storage.local.get('settings').then(({ settings }) => {
    if (!settings) {
      return DefaultSettings;
    }
    return Object.assign({}, DefaultSettings, settings);
  });
};

const loadValue = () => {
  return loadRaw().then((settings) => {
    let value = JSON.parse(DefaultSettings.json);
    if (settings.source === 'json') {
      value = settingsValues.valueFromJson(settings.json);
    } else if (settings.source === 'form') {
      value = settingsValues.valueFromForm(settings.form);
    }
    if (!value.properties) {
      value.properties = {};
    }
    return Object.assign({},
      settingsValues.valueFromJson(DefaultSettings.json),
      value);
  });
};

const save = (settings) => {
  return browser.storage.local.set({
    settings,
  });
};

export { loadRaw, loadValue, save };
