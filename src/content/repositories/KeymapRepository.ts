import Key from '../domains/Key';
import KeySequence from '../domains/KeySequence';

export default interface KeymapRepository {
  enqueueKey(key: Key): KeySequence;

  clear(): void;

  // eslint-disable-next-line semi
}

let current: KeySequence = KeySequence.from([]);

export class KeymapRepositoryImpl {

  enqueueKey(key: Key): KeySequence {
    current.push(key);
    return current;
  }

  clear(): void {
    current = KeySequence.from([]);
  }
}
