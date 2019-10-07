export type PropertiesJSON = {
  hintchars?: string;
  smoothscroll?: boolean;
  complete?: string;
};

export type PropertyTypes = {
  hintchars: string;
  smoothscroll: string;
  complete: string;
};

type PropertyName = 'hintchars' | 'smoothscroll' | 'complete';

type PropertyDef = {
  name: PropertyName;
  description: string;
  defaultValue: string | number | boolean;
  type: 'string' | 'number' | 'boolean';
};

const defs: PropertyDef[] = [
  {
    name: 'hintchars',
    description: 'hint characters on follow mode',
    defaultValue: 'abcdefghijklmnopqrstuvwxyz',
    type: 'string',
  }, {
    name: 'smoothscroll',
    description: 'smooth scroll',
    defaultValue: false,
    type: 'boolean',
  }, {
    name: 'complete',
    description: 'which are completed at the open page',
    defaultValue: 'sbh',
    type: 'string',
  }
];

const defaultValues = {
  hintchars: 'abcdefghijklmnopqrstuvwxyz',
  smoothscroll: false,
  complete: 'sbh',
};

export default class Properties {
  public hintchars: string;

  public smoothscroll: boolean;

  public complete: string;

  constructor({
    hintchars,
    smoothscroll,
    complete,
  }: {
    hintchars?: string;
    smoothscroll?: boolean;
    complete?: string;
  } = {}) {
    this.hintchars = hintchars || defaultValues.hintchars;
    this.smoothscroll = smoothscroll || defaultValues.smoothscroll;
    this.complete = complete || defaultValues.complete;
  }

  static fromJSON(json: any): Properties {
    let defNames: Set<string> = new Set(defs.map(def => def.name));
    let unknownName = Object.keys(json).find(name => !defNames.has(name));
    if (unknownName) {
      throw new TypeError(`Unknown property name: "${unknownName}"`);
    }

    for (let def of defs) {
      if (!Object.prototype.hasOwnProperty.call(json, def.name)) {
        continue;
      }
      if (typeof json[def.name] !== def.type) {
        throw new TypeError(
          `property "${def.name}" is not ${def.type}`);
      }
    }
    return new Properties(json);
  }

  static types(): PropertyTypes {
    return {
      hintchars: 'string',
      smoothscroll: 'boolean',
      complete: 'string',
    };
  }

  static def(name: string): PropertyDef | undefined {
    return defs.find(p => p.name === name);
  }

  static defs(): PropertyDef[] {
    return defs;
  }

  toJSON(): PropertiesJSON {
    return {
      hintchars: this.hintchars,
      smoothscroll: this.smoothscroll,
      complete: this.complete,
    };
  }
}
