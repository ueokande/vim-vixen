import * as inputActions from '../../actions/input';
import * as operationActions from '../../actions/operation';
import * as operations from '../../../shared/operations';
import * as keyUtils from '../../../shared/utils/keys';

import AddonEnabledUseCase from '../../usecases/AddonEnabledUseCase';
import { SettingRepositoryImpl } from '../../repositories/SettingRepository';
import { Keymaps } from '../../../shared/Settings';

type KeymapEntityMap = Map<keyUtils.Key[], operations.Operation>;

let addonEnabledUseCase = new AddonEnabledUseCase();
let settingRepository = new SettingRepositoryImpl();

const reservedKeymaps: Keymaps = {
  '<Esc>': { type: operations.CANCEL },
  '<C-[>': { type: operations.CANCEL },
};

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

  key(key: keyUtils.Key): boolean {
    this.store.dispatch(inputActions.keyPress(key));

    let input = this.store.getState().input;
    let keymaps = this.keymapEntityMap();
    let matched = Array.from(keymaps.keys()).filter(
      (mapping: keyUtils.Key[]) => {
        return mapStartsWith(mapping, input.keys);
      });
    if (!addonEnabledUseCase.getEnabled()) {
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
    let act = operationActions.exec(operation);
    this.store.dispatch(act);
    this.store.dispatch(inputActions.clearKeys());
    return true;
  }

  private keymapEntityMap(): KeymapEntityMap {
    let keymaps = {
      ...settingRepository.get().keymaps,
      ...reservedKeymaps,
    };
    let entries = Object.entries(keymaps).map((entry) => {
      return [
        keyUtils.fromMapKeys(entry[0]),
        entry[1],
      ];
    }) as [keyUtils.Key[], operations.Operation][];
    return new Map<keyUtils.Key[], operations.Operation>(entries);
  }
}
