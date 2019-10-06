import { injectable, inject } from 'tsyringe';
import KeymapRepository from '../repositories/KeymapRepository';
import SettingRepository from '../repositories/SettingRepository';
import AddonEnabledRepository from '../repositories/AddonEnabledRepository';
import * as operations from '../../shared/operations';
import Keymaps from '../../shared/settings/Keymaps';
import Key from '../../shared/settings/Key';
import KeySequence from '../../shared/settings/KeySequence';
import AddressRepository from '../repositories/AddressRepository';

type KeymapEntityMap = Map<KeySequence, operations.Operation>;

const reservedKeymaps = Keymaps.fromJSON({
  '<Esc>': { type: operations.CANCEL },
  '<C-[>': { type: operations.CANCEL },
});

@injectable()
export default class KeymapUseCase {
  constructor(
    @inject('KeymapRepository')
    private repository: KeymapRepository,

    @inject('SettingRepository')
    private settingRepository: SettingRepository,

    @inject('AddonEnabledRepository')
    private addonEnabledRepository: AddonEnabledRepository,

    @inject('AddressRepository')
    private addressRepository: AddressRepository,
  ) {
  }

  nextOp(key: Key): operations.Operation | null {
    let sequence = this.repository.enqueueKey(key);
    if (sequence.length() === 1 && this.blacklistKey(key)) {
      // ignore if the input starts with black list keys
      this.repository.clear();
      return null;
    }

    let keymaps = this.keymapEntityMap();
    let matched = Array.from(keymaps.keys()).filter(
      (mapping: KeySequence) => {
        return mapping.startsWith(sequence);
      });
    if (!this.addonEnabledRepository.get()) {
      // available keymaps are only ADDON_ENABLE and ADDON_TOGGLE_ENABLED if
      // the addon disabled
      matched = matched.filter((keymap) => {
        let type = (keymaps.get(keymap) as operations.Operation).type;
        return type === operations.ADDON_ENABLE ||
          type === operations.ADDON_TOGGLE_ENABLED;
      });
    }
    if (matched.length === 0) {
      // No operations to match with inputs
      this.repository.clear();
      return null;
    } else if (matched.length > 1 ||
      matched.length === 1 && sequence.length() < matched[0].length()) {
      // More than one operations are matched
      return null;
    }
    // Exactly one operation is matched
    let operation = keymaps.get(matched[0]) as operations.Operation;
    this.repository.clear();
    return operation;
  }

  clear(): void {
    this.repository.clear();
  }

  private keymapEntityMap(): KeymapEntityMap {
    let keymaps = this.settingRepository.get().keymaps.combine(reservedKeymaps);
    let entries = keymaps.entries().map(
      ([keys, op]) => [KeySequence.fromMapKeys(keys), op]
    ) as [KeySequence, operations.Operation][];
    return new Map<KeySequence, operations.Operation>(entries);
  }

  private blacklistKey(key: Key): boolean {
    let url = this.addressRepository.getCurrentURL();
    let blacklist = this.settingRepository.get().blacklist;
    return blacklist.includeKey(url, key);
  }
}
