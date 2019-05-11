import * as inputActions from '../../actions/input';
import * as operationActions from '../../actions/operation';
import * as operations from '../../../shared/operations';
import * as keyUtils from '../../../shared/utils/keys';

const mapStartsWith = (
  mapping: keyUtils.Key[],
  keys: keyUtils.Key[],
): boolean => {
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
  private store: any;

  constructor(store: any) {
    this.store = store;
  }

  // eslint-disable-next-line max-statements
  key(key: keyUtils.Key): boolean {
    this.store.dispatch(inputActions.keyPress(key));

    let state = this.store.getState();
    let input = state.input;
    let keymaps = new Map<keyUtils.Key[], operations.Operation>(
      state.setting.keymaps.map(
        (e: {key: keyUtils.Key[], op: operations.Operation}) => [e.key, e.op],
      )
    );

    let matched = Array.from(keymaps.keys()).filter(
      (mapping: keyUtils.Key[]) => {
        return mapStartsWith(mapping, input.keys);
      });
    if (!state.addon.enabled) {
      // available keymaps are only ADDON_ENABLE and ADDON_TOGGLE_ENABLED if
      // the addon disabled
      matched = matched.filter((keys) => {
        let type = (keymaps.get(keys) as operations.Operation).type;
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
    let operation = keymaps.get(matched[0]) as operations.Operation;
    let act = operationActions.exec(
      operation, state.setting, state.addon.enabled
    );
    this.store.dispatch(act);
    this.store.dispatch(inputActions.clearKeys());
    return true;
  }
}
