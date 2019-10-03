import Key from './Key';

export default class KeySequence {
  private keys: Key[];

  private constructor(keys: Key[]) {
    this.keys = keys;
  }

  static from(keys: Key[]): KeySequence {
    return new KeySequence(keys);
  }

  push(key: Key): number {
    return this.keys.push(key);
  }

  length(): number {
    return this.keys.length;
  }

  startsWith(o: KeySequence): boolean {
    if (this.keys.length < o.keys.length) {
      return false;
    }
    for (let i = 0; i < o.keys.length; ++i) {
      if (!this.keys[i].equals(o.keys[i])) {
        return false;
      }
    }
    return true;
  }

  getKeyArray(): Key[] {
    return this.keys;
  }
}

export const fromMapKeys = (keys: string): KeySequence => {
  const fromMapKeysRecursive = (
    remainings: string, mappedKeys: Key[],
  ): Key[] => {
    if (remainings.length === 0) {
      return mappedKeys;
    }

    let nextPos = 1;
    if (remainings.startsWith('<')) {
      let ltPos = remainings.indexOf('>');
      if (ltPos > 0) {
        nextPos = ltPos + 1;
      }
    }

    return fromMapKeysRecursive(
      remainings.slice(nextPos),
      mappedKeys.concat([Key.fromMapKey(remainings.slice(0, nextPos))])
    );
  };

  let data = fromMapKeysRecursive(keys, []);
  return KeySequence.from(data);
};

