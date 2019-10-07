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

  static fromJSON(json: any): Search {
    let defaultEngine = Search.getStringField(json, 'default');
    let engines = Search.getObjectField(json, 'engines');

    for (let [name, url] of Object.entries(engines)) {
      if ((/\s/).test(name)) {
        throw new TypeError(
          `While space in the search engine not allowed: "${name}"`);
      }
      if (typeof url !== 'string') {
        throw new TypeError(
          `Invalid type of value in filed "engines": ${JSON.stringify(json)}`);
      }
      let matches = url.match(/{}/g);
      if (matches === null) {
        throw new TypeError(`No {}-placeholders in URL of "${name}"`);
      } else if (matches.length > 1) {
        throw new TypeError(`Multiple {}-placeholders in URL of "${name}"`);
      }
    }

    if (!Object.keys(engines).includes(defaultEngine)) {
      throw new TypeError(`Default engine "${defaultEngine}" not found`);
    }

    return new Search(
      json.default as string,
      json.engines,
    );
  }

  toJSON(): SearchJSON {
    return {
      default: this.defaultEngine,
      engines: this.engines,
    };
  }

  private static getStringField(json: any, name: string): string {
    if (!Object.prototype.hasOwnProperty.call(json, name)) {
      throw new TypeError(
        `missing field "${name}" on search: ${JSON.stringify(json)}`);
    }
    if (typeof json[name] !== 'string') {
      throw new TypeError(
        `invalid type of filed "${name}" on search: ${JSON.stringify(json)}`);
    }
    return json[name];
  }

  private static getObjectField(json: any, name: string): Object {
    if (!Object.prototype.hasOwnProperty.call(json, name)) {
      throw new TypeError(
        `missing field "${name}" on search: ${JSON.stringify(json)}`);
    }
    if (typeof json[name] !== 'object' || json[name] === null) {
      throw new TypeError(
        `invalid type of filed "${name}" on search: ${JSON.stringify(json)}`);
    }
    return json[name];
  }
}
