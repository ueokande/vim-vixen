import * as actions from './index';
import * as keyUtils from '../../shared/utils/keys';
import * as operations from '../../shared/operations';
import * as messages from '../../shared/messages';

const reservedKeymaps = {
  '<Esc>': { type: operations.CANCEL },
  '<C-[>': { type: operations.CANCEL },
};

const set = (value: any): actions.SettingAction => {
  let entries: any[] = [];
  if (value.keymaps) {
    let keymaps = { ...value.keymaps, ...reservedKeymaps };
    entries = Object.entries(keymaps).map((entry) => {
      return [
        keyUtils.fromMapKeys(entry[0]),
        entry[1],
      ];
    });
  }

  return {
    type: actions.SETTING_SET,
    value: { ...value,
      keymaps: entries, }
  };
};

const load = async(): Promise<actions.SettingAction> => {
  let settings = await browser.runtime.sendMessage({
    type: messages.SETTINGS_QUERY,
  });
  return set(settings);
};

export { set, load };
