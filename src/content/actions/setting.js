import actions from 'content/actions';
import * as keyUtils from 'shared/utils/keys';

const set = (value) => {
  let maps = new Map();
  if (value.keymaps) {
    let entries = Object.entries(value.keymaps).map((entry) => {
      return [
        keyUtils.fromMapKeys(entry[0]),
        entry[1],
      ];
    });
    maps = new Map(entries);
  }

  return {
    type: actions.SETTING_SET,
    value: Object.assign({}, value, {
      keymaps: maps,
    })
  };
};

export { set };
