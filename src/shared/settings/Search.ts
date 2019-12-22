type Entries = { [name: string]: string };

export type SearchJSON = {
  default: string;
  engines: { [key: string]: string };
};

export default class Search {
  constructor(
    public defaultEngine: string,
    public engines: Entries,
  ) {
  }

  static fromJSON(json: SearchJSON): Search {
    for (const [name, url] of Object.entries(json.engines)) {
      if (!(/^[a-zA-Z0-9]+$/).test(name)) {
        throw new TypeError('Search engine\'s name must be [a-zA-Z0-9]+');
      }
      const matches = url.match(/{}/g);
      if (matches === null) {
        throw new TypeError(`No {}-placeholders in URL of "${name}"`);
      } else if (matches.length > 1) {
        throw new TypeError(`Multiple {}-placeholders in URL of "${name}"`);
      }
    }
    if (!Object.keys(json.engines).includes(json.default)) {
      throw new TypeError(`Default engine "${json.default}" not found`);
    }

    return new Search(json.default, json.engines);
  }

  toJSON(): SearchJSON {
    return {
      default: this.defaultEngine,
      engines: this.engines,
    };
  }
}
