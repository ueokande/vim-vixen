import * as operations from "./operations";
import Settings, { DefaultSettingJSONText } from "./settings/Settings";
import Keymaps from "./settings/Keymaps";
import Search from "./settings/Search";
import Properties from "./settings/Properties";
import Blacklist from "./settings/Blacklist";

export class FormKeymaps {
  private readonly data: { [op: string]: string };

  private constructor(data: { [op: string]: string }) {
    this.data = data;
  }

  toKeymaps(): Keymaps {
    const keymaps: { [key: string]: operations.Operation } = {};
    for (const name of Object.keys(this.data)) {
      const [type, argStr] = name.split("?");
      let args = {};
      if (argStr) {
        args = JSON.parse(argStr);
      }
      const key = this.data[name];
      keymaps[key] = operations.valueOf({ type, ...args });
    }
    return Keymaps.fromJSON(keymaps);
  }

  toJSON(): { [op: string]: string } {
    return this.data;
  }

  buildWithOverride(op: string, keys: string): FormKeymaps {
    const newData = {
      ...this.data,
      [op]: keys,
    };
    return new FormKeymaps(newData);
  }

  static fromJSON(o: ReturnType<FormKeymaps["toJSON"]>): FormKeymaps {
    const data: { [op: string]: string } = {};
    for (const op of Object.keys(o)) {
      data[op] = o[op] as string;
    }
    return new FormKeymaps(data);
  }

  static fromKeymaps(keymaps: Keymaps): FormKeymaps {
    const json = keymaps.toJSON();
    const data: { [op: string]: string } = {};
    for (const key of Object.keys(json)) {
      const op = json[key];
      const args = { ...op };
      delete args.type;

      let name = op.type;
      if (Object.keys(args).length > 0) {
        name += "?" + JSON.stringify(args);
      }
      data[name] = key;
    }
    return new FormKeymaps(data);
  }
}

export class FormSearch {
  private readonly default: string;

  private readonly engines: string[][];

  constructor(defaultEngine: string, engines: string[][]) {
    this.default = defaultEngine;
    this.engines = engines;
  }

  toSearchSettings(): Search {
    const engines: { [name: string]: string } = {};
    for (const entry of this.engines) {
      engines[entry[0]] = entry[1];
    }
    return new Search(this.default, engines);
  }

  toJSON(): {
    default: string;
    engines: string[][];
  } {
    return {
      default: this.default,
      engines: this.engines,
    };
  }

  static fromJSON(o: ReturnType<FormSearch["toJSON"]>): FormSearch {
    if (!Object.prototype.hasOwnProperty.call(o, "default")) {
      throw new TypeError(`"default" field not set`);
    }
    if (!Object.prototype.hasOwnProperty.call(o, "engines")) {
      throw new TypeError(`"engines" field not set`);
    }
    return new FormSearch(o.default, o.engines);
  }

  static fromSearch(search: Search): FormSearch {
    const engines = Object.entries(search.engines).reduce(
      (o: string[][], [name, url]) => {
        return o.concat([[name, url]]);
      },
      []
    );
    return new FormSearch(search.defaultEngine, engines);
  }
}

export class JSONTextSettings {
  constructor(private json: string) {}

  toSettings(): Settings {
    return Settings.fromJSON(JSON.parse(this.json));
  }

  toJSONText(): string {
    return this.json;
  }

  static fromText(o: string): JSONTextSettings {
    return new JSONTextSettings(o);
  }

  static fromSettings(data: Settings): JSONTextSettings {
    const json = {
      keymaps: data.keymaps.toJSON(),
      search: data.search,
      properties: data.properties,
      blacklist: data.blacklist,
    };
    return new JSONTextSettings(JSON.stringify(json, undefined, 2));
  }
}

export class FormSettings {
  public readonly keymaps: FormKeymaps;

  public readonly search: FormSearch;

  public readonly properties: Properties;

  public readonly blacklist: Blacklist;

  constructor(
    keymaps: FormKeymaps,
    search: FormSearch,
    properties: Properties,
    blacklist: Blacklist
  ) {
    this.keymaps = keymaps;
    this.search = search;
    this.properties = properties;
    this.blacklist = blacklist;
  }

  buildWithKeymaps(keymaps: FormKeymaps): FormSettings {
    return new FormSettings(
      keymaps,
      this.search,
      this.properties,
      this.blacklist
    );
  }

  buildWithSearch(search: FormSearch): FormSettings {
    return new FormSettings(
      this.keymaps,
      search,
      this.properties,
      this.blacklist
    );
  }

  buildWithProperties(props: Properties): FormSettings {
    return new FormSettings(this.keymaps, this.search, props, this.blacklist);
  }

  buildWithBlacklist(blacklist: Blacklist): FormSettings {
    return new FormSettings(
      this.keymaps,
      this.search,
      this.properties,
      blacklist
    );
  }

  toSettings(): Settings {
    return Settings.fromJSON({
      keymaps: this.keymaps.toKeymaps().toJSON(),
      search: this.search.toSearchSettings().toJSON(),
      properties: this.properties.toJSON(),
      blacklist: this.blacklist.toJSON(),
    });
  }

  toJSON(): {
    keymaps: ReturnType<FormKeymaps["toJSON"]>;
    search: ReturnType<FormSearch["toJSON"]>;
    properties: ReturnType<Properties["toJSON"]>;
    blacklist: ReturnType<Blacklist["toJSON"]>;
  } {
    return {
      keymaps: this.keymaps.toJSON(),
      search: this.search.toJSON(),
      properties: this.properties.toJSON(),
      blacklist: this.blacklist.toJSON(),
    };
  }

  static fromJSON(o: ReturnType<FormSettings["toJSON"]>): FormSettings {
    for (const name of ["keymaps", "search", "properties", "blacklist"]) {
      if (!Object.prototype.hasOwnProperty.call(o, name)) {
        throw new Error(`"${name}" field not set`);
      }
    }
    return new FormSettings(
      FormKeymaps.fromJSON(o.keymaps),
      FormSearch.fromJSON(o.search),
      Properties.fromJSON(o.properties),
      Blacklist.fromJSON(o.blacklist)
    );
  }

  static fromSettings(data: Settings): FormSettings {
    return new FormSettings(
      FormKeymaps.fromKeymaps(data.keymaps),
      FormSearch.fromSearch(data.search),
      data.properties,
      data.blacklist
    );
  }
}

export enum SettingSource {
  JSON = "json",
  Form = "form",
}

export default class SettingData {
  private source: SettingSource;

  private json?: JSONTextSettings;

  private form?: FormSettings;

  constructor({
    source,
    json,
    form,
  }: {
    source: SettingSource;
    json?: JSONTextSettings;
    form?: FormSettings;
  }) {
    this.source = source;
    this.json = json;
    this.form = form;
  }

  getSource(): SettingSource {
    return this.source;
  }

  getJSON(): JSONTextSettings {
    if (!this.json) {
      throw new TypeError("json settings not set");
    }
    return this.json;
  }

  getForm(): FormSettings {
    if (!this.form) {
      throw new TypeError("form settings not set");
    }
    return this.form;
  }

  toJSON(): any {
    switch (this.source) {
      case SettingSource.JSON:
        return {
          source: this.source,
          json: (this.json as JSONTextSettings).toJSONText(),
        };
      case SettingSource.Form:
        return {
          source: this.source,
          form: (this.form as FormSettings).toJSON(),
        };
    }
    throw new Error(`unknown settings source: ${this.source}`);
  }

  toSettings(): Settings {
    switch (this.source) {
      case SettingSource.JSON:
        return this.getJSON().toSettings();
      case SettingSource.Form:
        return this.getForm().toSettings();
    }
    throw new Error(`unknown settings source: ${this.source}`);
  }

  static fromJSON(o: {
    source: string;
    json?: string;
    form?: ReturnType<FormSettings["toJSON"]>;
  }): SettingData {
    switch (o.source) {
      case SettingSource.JSON:
        return new SettingData({
          source: o.source,
          json: JSONTextSettings.fromText(
            o.json as ReturnType<JSONTextSettings["toJSONText"]>
          ),
        });
      case SettingSource.Form:
        return new SettingData({
          source: o.source,
          form: FormSettings.fromJSON(
            o.form as ReturnType<FormSettings["toJSON"]>
          ),
        });
    }
    throw new Error(`unknown settings source: ${o.source}`);
  }
}

export const DefaultSettingData: SettingData = SettingData.fromJSON({
  source: "json",
  json: DefaultSettingJSONText,
});
