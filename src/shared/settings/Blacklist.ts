export type BlacklistJSON = string[];

const fromWildcard = (pattern: string): RegExp => {
  let regexStr = '^' + pattern.replace(/\*/g, '.*') + '$';
  return new RegExp(regexStr);
};

export default class Blacklist {
  constructor(
    private blacklist: string[],
  ) {
  }

  static fromJSON(json: any): Blacklist {
    if (!Array.isArray(json)) {
      throw new TypeError(`"blacklist" is not an array of string`);
    }
    for (let x of json) {
      if (typeof x !== 'string') {
        throw new TypeError(`"blacklist" is not an array of string`);
      }
    }
    return new Blacklist(json);
  }

  toJSON(): BlacklistJSON {
    return this.blacklist;
  }

  includes(url: string): boolean {
    let u = new URL(url);
    return this.blacklist.some((item) => {
      if (!item.includes('/')) {
        return fromWildcard(item).test(u.host);
      }
      return fromWildcard(item).test(u.host + u.pathname);
    });
  }
}
