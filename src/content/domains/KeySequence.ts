import Key from '../../shared/settings/Key';

export default class KeySequence {
  constructor(
    public readonly keys: Key[],
  ) {
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

  isDigitOnly(): boolean {
    return this.keys.every(key => key.isDigit());
  }

  repeatCount(): number {
    let nonDigitAt = this.keys.findIndex(key => !key.isDigit());
    if (this.keys.length === 0 || nonDigitAt === 0) {
      return 1;
    }
    if (nonDigitAt === -1) {
      nonDigitAt = this.keys.length;
    }
    const digits = this.keys.slice(0, nonDigitAt)
      .map(key => key.key)
      .join('');
    return Number(digits);
  }

  trimNumericPrefix(): KeySequence {
    let nonDigitAt = this.keys.findIndex(key => !key.isDigit());
    if (nonDigitAt === -1) {
      nonDigitAt = this.keys.length;
    }
    return new KeySequence(this.keys.slice(nonDigitAt));
  }

  splitNumericPrefix(): [KeySequence, KeySequence] {
    const nonDigitIndex = this.keys.findIndex(key => !key.isDigit());
    if (nonDigitIndex === -1) {
      return [this, new KeySequence([])];
    }
    return [
      new KeySequence(this.keys.slice(0, nonDigitIndex)),
      new KeySequence(this.keys.slice(nonDigitIndex)),
    ];
  }

  static fromMapKeys(keys: string): KeySequence {
    const fromMapKeysRecursive = (
      remaining: string, mappedKeys: Key[],
    ): Key[] => {
      if (remaining.length === 0) {
        return mappedKeys;
      }

      let nextPos = 1;
      if (remaining.startsWith('<')) {
        const ltPos = remaining.indexOf('>');
        if (ltPos > 0) {
          nextPos = ltPos + 1;
        }
      }

      return fromMapKeysRecursive(
        remaining.slice(nextPos),
        mappedKeys.concat([Key.fromMapKey(remaining.slice(0, nextPos))])
      );
    };

    const data = fromMapKeysRecursive(keys, []);
    return new KeySequence(data);
  }
}
