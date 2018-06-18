import actions from 'settings/actions';
import messages from 'shared/messages';
import DefaultSettings from 'shared/settings/default';
import * as settingsStorage from 'shared/settings/storage';
import * as settingsValues from 'shared/settings/values';

const load = async() => {
  let settings = await settingsStorage.loadRaw();
  return set(settings);
};

const save = async(settings) => {
  await settingsStorage.save(settings);
  await browser.runtime.sendMessage({
    type: messages.SETTINGS_RELOAD
  });
  return set(settings);
};

const set = (settings) => {
  let value = JSON.parse(DefaultSettings.json);
  if (settings.source === 'json') {
    value = settingsValues.valueFromJson(settings.json);
  } else if (settings.source === 'form') {
    value = settingsValues.valueFromForm(settings.form);
  }

  return {
    type: actions.SETTING_SET_SETTINGS,
    source: settings.source,
    json: settings.json,
    form: settings.form,
    value,
  };
};

export { load, save };
