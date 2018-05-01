import actions from 'content/actions';
import * as keyUtils from 'shared/utils/keys';
import operations from 'shared/operations';

const reservedKeymaps = {
  '<Esc>': { type: operations.CANCEL },
  '<C-[>': { type: operations.CANCEL },
};

const set = (value) => {
  let entries = [];
  if (value.keymaps) {
    let keymaps = Object.assign({}, value.keymaps, reservedKeymaps);
    entries = Object.entries(keymaps).map((entry) => {
      return [
        keyUtils.fromMapKeys(entry[0]),
        entry[1],
      ];
    });
  }

  return {
    type: actions.SETTING_SET,
    value: Object.assign({}, value, {
      keymaps: entries,
    })
  };
};

export { set };
