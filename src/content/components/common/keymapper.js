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

const parseKeyInput = (input) => {
  let countStr = '';
  let countScale = 1;

  for (let i = 0; i < input.keys.length; i++) {
    if (input.keys[i].key >= '0' && input.keys[i].key <= '9') {
      countStr += input.keys[i].key;
    } else {
      countScale = parseInt(countStr, 10);
      if (isNaN(countScale)) {
        countScale = 1;
      }
      break;
    }
  }
  let inputCommand = input.keys.slice(countStr.length);
  return [inputCommand, countScale];
};

export default class KeymapperComponent {
  constructor(store) {
    this.store = store;
  }

  executeOperation(key, state, operation, countScale) {
    if ('count' in operation) {
      let countTmp = operation.count;
      operation.count *= countScale;
      this.store.dispatch(operationActions.exec(
        operation, key.repeat, state.setting));
      operation.count = countTmp;
    } else {
      this.store.dispatch(operationActions.exec(
        operation, key.repeat, state.setting));
    }
  }

  key(key) {
    this.store.dispatch(inputActions.keyPress(key));

    let state = this.store.getState();
    let input = state.input;
    let keymaps = new Map(state.setting.keymaps);
    let [inputCommand, countScale] = parseKeyInput(input);

    let matched = Array.from(keymaps.keys()).filter((mapping) => {
      return mapStartsWith(mapping, inputCommand);
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
      matched.length === 1 && inputCommand.length < matched[0].length) {
      return true;
    }
    this.executeOperation(key, state, keymaps.get(matched[0]), countScale);
    this.store.dispatch(inputActions.clearKeys());
    return true;
  }
}
