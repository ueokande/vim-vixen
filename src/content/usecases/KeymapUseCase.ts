import { injectable, inject } from 'tsyringe';
import KeymapRepository from '../repositories/KeymapRepository';
import SettingRepository from '../repositories/SettingRepository';
import AddonEnabledRepository from '../repositories/AddonEnabledRepository';
import * as operations from '../../shared/operations';
import Keymaps from '../../shared/settings/Keymaps';
import Key from '../../shared/settings/Key';
import KeySequence from '../domains/KeySequence';
import AddressRepository from '../repositories/AddressRepository';

const reservedKeymaps = Keymaps.fromJSON({
  '<Esc>': { type: operations.CANCEL },
  '<C-[>': { type: operations.CANCEL },
});

const enableAddonOps = [
  operations.ADDON_ENABLE,
  operations.ADDON_TOGGLE_ENABLED,
];

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

  // eslint-disable-next-line max-statements
  nextOps(key: Key): { repeat: number, op: operations.Operation } | null {
    const sequence = this.repository.enqueueKey(key);
    const baseSequence = sequence.trimNumericPrefix();
    if (baseSequence.length() === 1 && this.blacklistKey(key)) {
      // ignore if the input starts with black list keys
      this.repository.clear();
      return null;
    }

    const keymaps = this.keymapEntityMap();
    const matched = keymaps.filter(([seq]) => seq.startsWith(sequence));
    const baseMatched = keymaps.filter(([seq]) => seq.startsWith(baseSequence));

    if (matched.length === 1 &&
        sequence.length() === matched[0][0].length()) {
      // keys are matched with an operation
      this.repository.clear();
      return { repeat: 1, op: matched[0][1] };
    } else if (
      baseMatched.length === 1 &&
        baseSequence.length() === baseMatched[0][0].length()) {
      // keys are matched with an operation with a numeric prefix
      this.repository.clear();
      return { repeat: sequence.repeatCount(), op: baseMatched[0][1] };
    } else if (matched.length >= 1 || baseMatched.length >= 1) {
      // keys are matched with an operation's prefix
      return null;
    }

    // matched with no operations
    this.repository.clear();
    return null;
  }

  private keymapEntityMap(): [KeySequence, operations.Operation][] {
    const keymaps = this.settingRepository.get().keymaps.combine(reservedKeymaps);
    let entries = keymaps.entries().map(
      ([keys, op]) => [KeySequence.fromMapKeys(keys), op]
    ) as [KeySequence, operations.Operation][];
    if (!this.addonEnabledRepository.get()) {
      // available keymaps are only ADDON_ENABLE and ADDON_TOGGLE_ENABLED if
      // the addon disabled
      entries = entries.filter(
        ([_seq, { type }]) => enableAddonOps.includes(type)
      );
    }
    return entries;
  }

  private blacklistKey(key: Key): boolean {
    const url = this.addressRepository.getCurrentURL();
    const blacklist = this.settingRepository.get().blacklist;
    return blacklist.includeKey(url, key);
  }
}
