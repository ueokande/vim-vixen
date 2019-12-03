import Key from './Key';
import Validator from './Validator';

const ItemSchema = {
  anyOf: [
    { type: 'string' },
    {
      type: 'object',
      properties: {
        url: { type: 'string' },
        keys: {
          type: 'array',
          items: { type: 'string', minLength: 1 },
          minItems: 1,
        }
      },
      required: ['url', 'keys'],
    }
  ],
};

export type BlacklistItemJSON = string | {
  url: string,
  keys: string[],
};

export type BlacklistJSON = BlacklistItemJSON[];

const regexFromWildcard = (pattern: string): RegExp => {
  let regexStr = '^' + pattern.replace(/\*/g, '.*') + '$';
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

  static fromJSON(json: unknown): BlacklistItem {
    let obj = new Validator<BlacklistItemJSON>(ItemSchema).validate(json);
    return typeof obj === 'string'
      ? new BlacklistItem(obj, false, [])
      : new BlacklistItem(obj.url, true, obj.keys);
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

  static fromJSON(json: unknown): Blacklist {
    if (!Array.isArray(json)) {
      throw new TypeError('blacklist is not an array');
    }
    let items = json.map(o => BlacklistItem.fromJSON(o));
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
