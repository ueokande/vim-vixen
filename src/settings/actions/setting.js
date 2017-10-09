import actions from 'settings/actions';
import messages from 'shared/messages';
import DefaultSettings from 'shared/default-settings';

const load = () => {
  return browser.storage.local.get('settings').then((value) => {
    let settings = value.settings;
    if (settings) {
      return set(settings);
    }
    return set(DefaultSettings);
  }, console.error);
};

const save = (settings) => {
  return browser.storage.local.set({
    settings,
  }).then(() => {
    return browser.runtime.sendMessage({
      type: messages.SETTINGS_RELOAD
    });
  });
};

const set = (settings) => {
  return {
    type: actions.SETTING_SET_SETTINGS,
    json: settings.json,
    value: JSON.parse(settings.json),
  };
};

export { load, save };
