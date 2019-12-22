import * as operations from '../operations';

type OperationJson = {
  type: string
} | {
  type: string;
  [prop: string]: string | number | boolean;
};
export type KeymapsJSON = { [key: string]: OperationJson };

export default class Keymaps {
  constructor(
    private readonly data: { [key: string]: operations.Operation },
  ) {
  }

  static fromJSON(json: KeymapsJSON): Keymaps {
    const entries: { [key: string]: operations.Operation } = {};
    for (const key of Object.keys(json)) {
      entries[key] = operations.valueOf(json[key]);
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
