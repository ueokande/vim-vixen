import * as inputActions from 'content/actions/input';
import * as operationActions from 'content/actions/operation';
import operations from 'shared/operations';
import * as keyUtils from 'shared/utils/keys';

const mapStartsWith = (mapping, keys) => {
  if (mapping.length < keys.length) {
    return false;
  }
  for (let i = 0; i < keys.length; ++i) {
    if (!keyUtils.equals(mapping[i], keys[i])) {
      return false;
    }
  }
  return true;
};

export default class KeymapperComponent {
  constructor(store) {
    this.store = store;
  }

  key(key) {
    this.store.dispatch(inputActions.keyPress(key));

    let state = this.store.getState();
    let input = state.input;
    let keymaps = new Map(state.setting.keymaps);

    let matched = Array.from(keymaps.keys()).filter((mapping) => {
      return mapStartsWith(mapping, input.keys);
    });
    if (!state.addon.enabled) {
      // available keymaps are only ADDON_ENABLE and ADDON_TOGGLE_ENABLED if
      // the addon disabled
      matched = matched.filter((keys) => {
        let type = keymaps.get(keys).type;
        return type === operations.ADDON_ENABLE ||
          type === operations.ADDON_TOGGLE_ENABLED;
      });
    }
    if (matched.length === 0) {
      this.store.dispatch(inputActions.clearKeys());
      return false;
    } else if (matched.length > 1 ||
      matched.length === 1 && input.keys.length < matched[0].length) {
      return true;
    }
    let operation = keymaps.get(matched[0]);
    this.store.dispatch(operationActions.exec(
      operation, key.repeat, state.setting));
    this.store.dispatch(inputActions.clearKeys());
    return true;
  }
}
