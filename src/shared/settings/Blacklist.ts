import Key from './Key';

export type BlacklistItemJSON = string | {
  url: string,
  keys: string[],
};

export type BlacklistJSON = BlacklistItemJSON[];

const regexFromWildcard = (pattern: string): RegExp => {
  const regexStr = '^' + pattern.replace(/\*/g, '.*') + '$';
  return new RegExp(regexStr);
};

export class BlacklistItem {
  public readonly pattern: string;

  private regex: RegExp;

  public readonly partial: boolean;

  public readonly keys: string[];

  private readonly keyEntities: Key[];

  constructor(
    pattern: string,
    partial: boolean,
    keys: string[]
  ) {
    this.pattern = pattern;
    this.regex = regexFromWildcard(pattern);
    this.partial = partial;
    this.keys = keys;
    this.keyEntities = this.keys.map(Key.fromMapKey);
  }

  static fromJSON(json: BlacklistItemJSON): BlacklistItem {
    return typeof json === 'string'
      ? new BlacklistItem(json, false, [])
      : new BlacklistItem(json.url, true, json.keys);
  }

  toJSON(): BlacklistItemJSON {
    if (!this.partial) {
      return this.pattern;
    }
    return { url: this.pattern, keys: this.keys };
  }

  matches(url: URL): boolean {
    return this.pattern.includes('/')
      ? this.regex.test(url.host + url.pathname)
      : this.regex.test(url.host);
  }

  includeKey(url: URL, key: Key): boolean {
    if (!this.matches(url)) {
      return false;
    }
    if (!this.partial) {
      return true;
    }
    return this.keyEntities.some(k => k.equals(key));
  }
}

export default class Blacklist {
  constructor(
    public readonly items: BlacklistItem[],
  ) {
  }

  static fromJSON(json: BlacklistJSON): Blacklist {
    const items = json.map(o => BlacklistItem.fromJSON(o));
    return new Blacklist(items);
  }

  toJSON(): BlacklistJSON {
    return this.items.map(item => item.toJSON());
  }

  includesEntireBlacklist(url: URL): boolean {
    return this.items.some(item => !item.partial && item.matches(url));
  }

  includeKey(url: URL, key: Key) {
    return this.items.some(item => item.includeKey(url, key));
  }
}
