import actions from 'content/actions';
import * as keyUtils from 'shared/utils/keys';
import operations from 'shared/operations';
import messages from 'shared/messages';

const reservedKeymaps = {
  '<Esc>': { type: operations.CANCEL },
  '<C-[>': { type: operations.CANCEL },
};

const set = (value) => {
  let entries = [];
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

const load = async() => {
  let settings = await browser.runtime.sendMessage({
    type: messages.SETTINGS_QUERY,
  });
  return set(settings);
};

export { load };
