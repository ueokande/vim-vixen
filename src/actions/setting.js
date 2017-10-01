import actions from '../actions';
import messages from '../content/messages';
import DefaultSettings from '../shared/default-settings';

const load = () => {
  return browser.storage.local.get('settings').then((value) => {
    if (value.settings) {
      return set(value.settings);
    }
    return set(DefaultSettings);
  }, console.error);
};

const save = (settings) => {
  return browser.storage.local.set({
    settings
  }).then(() => {
    return browser.runtime.sendMessage({
      type: messages.SETTINGS_RELOAD
    });
  });
};

const set = (settings) => {
  return {
    type: actions.SETTING_SET_SETTINGS,
    settings,
  };
};

export { load, save, set };
