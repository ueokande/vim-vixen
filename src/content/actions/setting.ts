import * as actions from './index';
import * as operations from '../../shared/operations';
import * as messages from '../../shared/messages';
import Settings, { Keymaps } from '../../shared/Settings';

const reservedKeymaps: Keymaps = {
  '<Esc>': { type: operations.CANCEL },
  '<C-[>': { type: operations.CANCEL },
};

const set = (settings: Settings): actions.SettingAction => {
  return {
    type: actions.SETTING_SET,
    settings: {
      ...settings,
      keymaps: { ...settings.keymaps, ...reservedKeymaps },
    }
  };
};

const load = async(): Promise<actions.SettingAction> => {
  let settings = await browser.runtime.sendMessage({
    type: messages.SETTINGS_QUERY,
  });
  return set(settings);
};

export { set, load };
