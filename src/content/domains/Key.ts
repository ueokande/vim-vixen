const modifiedKeyName = (name: string): string => {
  if (name === ' ') {
    return 'Space';
  }
  if (name.length === 1) {
    return name;
  } else if (name === 'Escape') {
    return 'Esc';
  }
  return name;
};

export default class Key {
  public readonly key: string;

  public readonly shift: boolean;

  public readonly ctrl: boolean;

  public readonly alt: boolean;

  public readonly meta: boolean;

  constructor({ key, shift, ctrl, alt, meta }: {
    key: string;
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  }) {
    this.key = key;
    this.shift = shift;
    this.ctrl = ctrl;
    this.alt = alt;
    this.meta = meta;
  }

  static fromMapKey(str: string): Key {
    if (str.startsWith('<') && str.endsWith('>')) {
      let inner = str.slice(1, -1);
      let shift = inner.includes('S-');
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

  static fromKeyboardEvent(e: KeyboardEvent): Key {
    let key = modifiedKeyName(e.key);
    let shift = e.shiftKey;
    if (key.length === 1 && key.toUpperCase() === key.toLowerCase()) {
      // make shift false for symbols to enable key bindings by symbold keys.
      // But this limits key bindings by symbol keys with Shift
      // (such as Shift+$>.
      shift = false;
    }

    return new Key({
      key: modifiedKeyName(e.key),
      shift: shift,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey,
    });
  }

  equals(key: Key) {
    return this.key === key.key &&
        this.ctrl === key.ctrl &&
        this.meta === key.meta &&
        this.alt === key.alt &&
        this.shift === key.shift;
  }
}

