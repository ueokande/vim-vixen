import Key from './Key';

export type BlacklistItemJSON = string | {
  url: string,
  keys: string[],
};

export type BlacklistJSON = BlacklistItemJSON[];

const regexFromWildcard = (pattern: string): RegExp => {
  let regexStr = '^' + pattern.replace(/\*/g, '.*') + '$';
  return new RegExp(regexStr);
};

const isArrayOfString = (raw: any): boolean => {
  if (!Array.isArray(raw)) {
    return false;
  }
  for (let x of Array.from(raw)) {
    if (typeof x !== 'string') {
      return false;
    }
  }
  return true;
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

  static fromJSON(raw: any): BlacklistItem {
    if (typeof raw === 'string') {
      return new BlacklistItem(raw, false, []);
    } else if (typeof raw === 'object' && raw !== null) {
      if (!('url' in raw)) {
        throw new TypeError(
          `missing field "url" of blacklist item: ${JSON.stringify(raw)}`);
      }
      if (typeof raw.url !== 'string') {
        throw new TypeError(
          `invalid field "url" of blacklist item: ${JSON.stringify(raw)}`);
      }
      if (!('keys' in raw)) {
        throw new TypeError(
          `missing field "keys" of blacklist item: ${JSON.stringify(raw)}`);
      }
      if (!isArrayOfString(raw.keys)) {
        throw new TypeError(
          `invalid field "keys" of blacklist item: ${JSON.stringify(raw)}`);
      }
      return new BlacklistItem(raw.url as string, true, raw.keys as string[]);
    }
    throw new TypeError(
      `invalid format of blacklist item: ${JSON.stringify(raw)}`);
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

  static fromJSON(json: any): Blacklist {
    if (!Array.isArray(json)) {
      throw new TypeError('blacklist is not an array: ' + JSON.stringify(json));
    }
    let items = Array.from(json).map(item => BlacklistItem.fromJSON(item));
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
