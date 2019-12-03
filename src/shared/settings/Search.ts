import Validator from './Validator';

const Schema = {
  type: 'object',
  properties: {
    default: { type: 'string' },
    engines: {
      type: 'object',
      propertyNames: {
        pattern: '^[A-Za-z_][A-Za-z0-9_]+$',
      },
      patternProperties: {
        '.*': { type: 'string' },
      },
    },
  },
  required: ['default'],
};

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

  static fromJSON(json: unknown): Search {
    let obj = new Validator<SearchJSON>(Schema).validate(json);

    for (let [name, url] of Object.entries(obj.engines)) {
      let matches = url.match(/{}/g);
      if (matches === null) {
        throw new TypeError(`No {}-placeholders in URL of "${name}"`);
      } else if (matches.length > 1) {
        throw new TypeError(`Multiple {}-placeholders in URL of "${name}"`);
      }
    }
    if (!Object.keys(obj.engines).includes(obj.default)) {
      throw new TypeError(`Default engine "${obj.default}" not found`);
    }

    return new Search(obj.default, obj.engines);
  }

  toJSON(): SearchJSON {
    return {
      default: this.defaultEngine,
      engines: this.engines,
    };
  }
}
