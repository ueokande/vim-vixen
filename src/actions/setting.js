import actions from '../actions';
import messages from '../content/messages';

const load = () => {
  return browser.storage.local.get('settings').then((value) => {
    return set(value.settings);
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
