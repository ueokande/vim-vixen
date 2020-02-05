const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default class Key {
  public readonly key: string;

  public readonly shift: boolean;

  public readonly ctrl: boolean;

  public readonly alt: boolean;

  public readonly meta: boolean;

  constructor({
    key,
    shift = false,
    ctrl = false,
    alt = false,
    meta = false,
  }: {
    key: string;
    shift?: boolean;
    ctrl?: boolean;
    alt?: boolean;
    meta?: boolean;
  }) {
    this.key = key;
    this.shift = shift;
    this.ctrl = ctrl;
    this.alt = alt;
    this.meta = meta;
  }

  static fromMapKey(str: string): Key {
    if (str.startsWith('<') && str.endsWith('>')) {
      const inner = str.slice(1, -1);
      const shift = inner.includes('S-');
      let base = inner.slice(inner.lastIndexOf('-') + 1);
      if (shift && base.length === 1) {
        base = base.toUpperCase();
      } else if (!shift && base.length === 1) {
        base = base.toLowerCase();
      }
      return new Key({
        key: base,
        shift: shift,
        ctrl: inner.includes('C-'),
        alt: inner.includes('A-'),
        meta: inner.includes('M-'),
      });
    }

    return new Key({
      key: str,
      shift: str.toLowerCase() !== str,
      ctrl: false,
      alt: false,
      meta: false,
    });
  }

  isDigit(): boolean {
    return digits.includes(this.key) && !this.ctrl && !this.alt && !this.meta;
  }

  equals(key: Key) {
    return this.key === key.key &&
      this.ctrl === key.ctrl &&
      this.meta === key.meta &&
      this.alt === key.alt &&
      this.shift === key.shift;
  }
}
