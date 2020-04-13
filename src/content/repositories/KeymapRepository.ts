import Key from "../../shared/settings/Key";
import KeySequence from "../domains/KeySequence";

export default interface KeymapRepository {
  enqueueKey(key: Key): KeySequence;

  clear(): void;
}

let current: KeySequence = new KeySequence([]);

export class KeymapRepositoryImpl {
  enqueueKey(key: Key): KeySequence {
    current.push(key);
    return current;
  }

  clear(): void {
    current = new KeySequence([]);
  }
}
