import actions from 'content/actions';
import * as keyUtils from 'shared/utils/keys';

const set = (value) => {
  let entries = [];
  if (value.keymaps) {
    entries = Object.entries(value.keymaps).map((entry) => {
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
