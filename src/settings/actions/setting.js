import actions from 'settings/actions';
import messages from 'shared/messages';
import DefaultSettings from 'shared/default-settings';

const load = () => {
  return browser.storage.local.get('settings').then(({ settings }) => {
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
    }).then(() => {
      return set(settings);
    });
  });
};

const set = (settings) => {
  return {
    type: actions.SETTING_SET_SETTINGS,
    source: settings.source,
    json: settings.json,
    value: JSON.parse(settings.json),
  };
};

export { load, save };
