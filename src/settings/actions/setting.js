import actions from 'settings/actions';
import messages from 'shared/messages';
import DefaultSettings from 'shared/settings/default';
import * as settingsValues from 'shared/settings/values';

const load = () => {
  return browser.storage.local.get('settings').then(({ settings }) => {
    if (!settings) {
      return set(DefaultSettings);
    }
    return set(Object.assign({}, DefaultSettings, settings));
  }, console.error);
};

const save = (settings) => {
  return browser.storage.local.set({
    settings,
  }).then(() => {
    return browser.runtime.sendMessage({
      type: messages.SETTINGS_RELOAD
    }).then(() => {
      return set(settings);
    });
  });
};

const set = (settings) => {
  let value = JSON.parse(DefaultSettings.json);
  if (settings.source === 'json') {
    value = settingsValues.fromJson(settings.json);
  } else if (settings.source === 'form') {
    value = settingsValues.fromForm(settings.form);
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
