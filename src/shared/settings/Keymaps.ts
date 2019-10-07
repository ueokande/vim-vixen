import * as operations from '../operations';

export type KeymapsJSON = { [key: string]: operations.Operation };

export default class Keymaps {
  constructor(
    private readonly data: KeymapsJSON,
  ) {
  }

  static fromJSON(json: any): Keymaps {
    if (typeof json !== 'object' || json === null) {
      throw new TypeError('invalid keymaps type: ' + JSON.stringify(json));
    }

    let data: KeymapsJSON = {};
    for (let key of Object.keys(json)) {
      data[key] = operations.valueOf(json[key]);
    }
    return new Keymaps(data);
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
