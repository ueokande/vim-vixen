import * as operations from '../operations';
import Validator from './Validator';

const Schema = {
  type: 'object',
  patternProperties: {
    '.*': {
      type: 'object',
      properties: {
        type: { type: 'string' },
      },
      required: ['type'],
    },
  }
};

export type KeymapsJSON = { [key: string]: operations.Operation };

export default class Keymaps {
  constructor(
    private readonly data: KeymapsJSON,
  ) {
  }

  static fromJSON(json: unknown): Keymaps {
    let obj = new Validator<KeymapsJSON>(Schema).validate(json);
    let entries: KeymapsJSON = {};
    for (let key of Object.keys(obj)) {
      entries[key] = operations.valueOf(obj[key]);
    }
    return new Keymaps(entries);
  }

  combine(other: Keymaps): Keymaps {
    return new Keymaps({
      ...this.data,
      ...other.data,
    });
  }

  toJSON(): KeymapsJSON {
    return this.data;
  }

  entries(): [string, operations.Operation][] {
    return Object.entries(this.data);
  }
}
