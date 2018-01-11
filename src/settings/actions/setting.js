import actions from 'settings/actions';
import messages from 'shared/messages';
import DefaultSettings from 'shared/settings/default';
import * as settingsStorage from 'shared/settings/storage';
import * as settingsValues from 'shared/settings/values';

const load = () => {
  return settingsStorage.loadRaw().then((settings) => {
    return set(settings);
  });
};

const save = (settings) => {
  return settingsStorage.save(settings).then(() => {
    return browser.runtime.sendMessage({
      type: messages.SETTINGS_RELOAD
    });
  }).then(() => {
    return set(settings);
  });
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
