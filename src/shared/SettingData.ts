import * as operations from './operations';
import Settings, * as settings from './Settings';
import Keymaps from './settings/Keymaps';
import Search from './settings/Search';

export class FormKeymaps {
  private data: {[op: string]: string};

  constructor(data: {[op: string]: string}) {
    this.data = data;
  }

  toKeymaps(): Keymaps {
    let keymaps: { [key: string]: operations.Operation } = {};
    for (let name of Object.keys(this.data)) {
      let [type, argStr] = name.split('?');
      let args = {};
      if (argStr) {
        args = JSON.parse(argStr);
      }
      let key = this.data[name];
      keymaps[key] = operations.valueOf({ type, ...args });
    }
    return Keymaps.fromJSON(keymaps);
  }

  toJSON(): {[op: string]: string} {
    return this.data;
  }

  buildWithOverride(op: string, keys: string): FormKeymaps {
    let newData = {
      ...this.data,
      [op]: keys,
    };
    return new FormKeymaps(newData);
  }

  static valueOf(o: ReturnType<FormKeymaps['toJSON']>): FormKeymaps {
    let data: {[op: string]: string} = {};
    for (let op of Object.keys(o)) {
      data[op] = o[op] as string;
    }
    return new FormKeymaps(data);
  }

  static fromKeymaps(keymaps: Keymaps): FormKeymaps {
    let json = keymaps.toJSON();
    let data: {[op: string]: string} = {};
    for (let key of Object.keys(json)) {
      let op = json[key];
      let args = { ...op };
      delete args.type;

      let name = op.type;
      if (Object.keys(args).length > 0) {
        name += '?' + JSON.stringify(args);
      }
      data[name] = key;
    }
    return new FormKeymaps(data);
  }
}

export class FormSearch {
  private default: string;

  private engines: string[][];

  constructor(defaultEngine: string, engines: string[][]) {
    this.default = defaultEngine;
    this.engines = engines;
  }

  toSearchSettings(): Search {
    let engines: { [name: string]: string } = {};
    for (let entry of this.engines) {
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

  static valueOf(o: ReturnType<FormSearch['toJSON']>): FormSearch {
    if (!Object.prototype.hasOwnProperty.call(o, 'default')) {
      throw new TypeError(`"default" field not set`);
    }
    if (!Object.prototype.hasOwnProperty.call(o, 'engines')) {
      throw new TypeError(`"engines" field not set`);
    }
    return new FormSearch(o.default, o.engines);
  }

  static fromSearch(search: Search): FormSearch {
    let engines = Object.entries(search.engines).reduce(
      (o: string[][], [name, url]) => {
        return o.concat([[name, url]]);
      }, []);
    return new FormSearch(search.defaultEngine, engines);
  }
}

export class JSONTextSettings {
  constructor(
    private json: string,
  ) {
  }

  toSettings(): Settings {
    return settings.valueOf(JSON.parse(this.json));
  }

  toJSONText(): string {
    return this.json;
  }

  static fromText(o: string): JSONTextSettings {
    return new JSONTextSettings(o);
  }

  static fromSettings(data: Settings): JSONTextSettings {
    let json = {
      keymaps: data.keymaps.toJSON(),
      search: data.search,
      properties: data.properties,
      blacklist: data.blacklist,
    };
    return new JSONTextSettings(JSON.stringify(json, undefined, 2));
  }
}

export class FormSettings {
  private keymaps: FormKeymaps;

  private search: FormSearch;

  private properties: settings.Properties;

  private blacklist: string[];

  constructor(
    keymaps: FormKeymaps,
    search: FormSearch,
    properties: settings.Properties,
    blacklist: string[],
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
      this.blacklist,
    );
  }

  buildWithSearch(search: FormSearch): FormSettings {
    return new FormSettings(
      this.keymaps,
      search,
      this.properties,
      this.blacklist,
    );
  }

  buildWithProperties(props: settings.Properties): FormSettings {
    return new FormSettings(
      this.keymaps,
      this.search,
      props,
      this.blacklist,
    );
  }

  buildWithBlacklist(blacklist: string[]): FormSettings {
    return new FormSettings(
      this.keymaps,
      this.search,
      this.properties,
      blacklist,
    );
  }

  toSettings(): Settings {
    return settings.valueOf({
      keymaps: this.keymaps.toKeymaps().toJSON(),
      search: this.search.toSearchSettings().toJSON(),
      properties: this.properties,
      blacklist: this.blacklist,
    });
  }

  toJSON(): {
    keymaps: ReturnType<FormKeymaps['toJSON']>;
    search: ReturnType<FormSearch['toJSON']>;
    properties: settings.Properties;
    blacklist: string[];
    } {
    return {
      keymaps: this.keymaps.toJSON(),
      search: this.search.toJSON(),
      properties: this.properties,
      blacklist: this.blacklist,
    };
  }

  static valueOf(o: ReturnType<FormSettings['toJSON']>): FormSettings {
    for (let name of ['keymaps', 'search', 'properties', 'blacklist']) {
      if (!Object.prototype.hasOwnProperty.call(o, name)) {
        throw new Error(`"${name}" field not set`);
      }
    }
    return new FormSettings(
      FormKeymaps.valueOf(o.keymaps),
      FormSearch.valueOf(o.search),
      settings.propertiesValueOf(o.properties),
      settings.blacklistValueOf(o.blacklist),
    );
  }

  static fromSettings(data: Settings): FormSettings {
    return new FormSettings(
      FormKeymaps.fromKeymaps(data.keymaps),
      FormSearch.fromSearch(data.search),
      data.properties,
      data.blacklist);
  }
}

export enum SettingSource {
  JSON = 'json',
  Form = 'form',
}

export default class SettingData {
  private source: SettingSource;

  private json?: JSONTextSettings;

  private form?: FormSettings;

  constructor({
    source, json, form
  }: {
    source: SettingSource,
    json?: JSONTextSettings,
    form?: FormSettings,
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
      throw new TypeError('json settings not set');
    }
    return this.json;
  }

  getForm(): FormSettings {
    if (!this.form) {
      throw new TypeError('form settings not set');
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

  static valueOf(o: {
    source: string;
    json?: string;
    form?: ReturnType<FormSettings['toJSON']>;
  }): SettingData {
    switch (o.source) {
    case SettingSource.JSON:
      return new SettingData({
        source: o.source,
        json: JSONTextSettings.fromText(
          o.json as ReturnType<JSONTextSettings['toJSONText']>),
      });
    case SettingSource.Form:
      return new SettingData({
        source: o.source,
        form: FormSettings.valueOf(
          o.form as ReturnType<FormSettings['toJSON']>),
      });
    }
    throw new Error(`unknown settings source: ${o.source}`);
  }
}

export const DefaultSettingData: SettingData = SettingData.valueOf({
  source: 'json',
  json: `{
  "keymaps": {
    "0": { "type": "scroll.home" },
    ":": { "type": "command.show" },
    "o": { "type": "command.show.open", "alter": false },
    "O": { "type": "command.show.open", "alter": true },
    "t": { "type": "command.show.tabopen", "alter": false },
    "T": { "type": "command.show.tabopen", "alter": true },
    "w": { "type": "command.show.winopen", "alter": false },
    "W": { "type": "command.show.winopen", "alter": true },
    "b": { "type": "command.show.buffer" },
    "a": { "type": "command.show.addbookmark", "alter": true },
    "k": { "type": "scroll.vertically", "count": -1 },
    "j": { "type": "scroll.vertically", "count": 1 },
    "h": { "type": "scroll.horizonally", "count": -1 },
    "l": { "type": "scroll.horizonally", "count": 1 },
    "<C-U>": { "type": "scroll.pages", "count": -0.5 },
    "<C-D>": { "type": "scroll.pages", "count": 0.5 },
    "<C-B>": { "type": "scroll.pages", "count": -1 },
    "<C-F>": { "type": "scroll.pages", "count": 1 },
    "gg": { "type": "scroll.top" },
    "G": { "type": "scroll.bottom" },
    "$": { "type": "scroll.end" },
    "d": { "type": "tabs.close" },
    "D": { "type": "tabs.close", "select": "left" },
    "x$": { "type": "tabs.close.right" },
    "!d": { "type": "tabs.close.force" },
    "u": { "type": "tabs.reopen" },
    "K": { "type": "tabs.prev" },
    "J": { "type": "tabs.next" },
    "gT": { "type": "tabs.prev" },
    "gt": { "type": "tabs.next" },
    "g0": { "type": "tabs.first" },
    "g$": { "type": "tabs.last" },
    "<C-6>": { "type": "tabs.prevsel" },
    "r": { "type": "tabs.reload", "cache": false },
    "R": { "type": "tabs.reload", "cache": true },
    "zp": { "type": "tabs.pin.toggle" },
    "zd": { "type": "tabs.duplicate" },
    "zi": { "type": "zoom.in" },
    "zo": { "type": "zoom.out" },
    "zz": { "type": "zoom.neutral" },
    "f": { "type": "follow.start", "newTab": false },
    "F": { "type": "follow.start", "newTab": true, "background": false },
    "m": { "type": "mark.set.prefix" },
    "'": { "type": "mark.jump.prefix" },
    "H": { "type": "navigate.history.prev" },
    "L": { "type": "navigate.history.next" },
    "[[": { "type": "navigate.link.prev" },
    "]]": { "type": "navigate.link.next" },
    "gu": { "type": "navigate.parent" },
    "gU": { "type": "navigate.root" },
    "gi": { "type": "focus.input" },
    "gf": { "type": "page.source" },
    "gh": { "type": "page.home" },
    "gH": { "type": "page.home", "newTab": true },
    "y": { "type": "urls.yank" },
    "p": { "type": "urls.paste", "newTab": false },
    "P": { "type": "urls.paste", "newTab": true },
    "/": { "type": "find.start" },
    "n": { "type": "find.next" },
    "N": { "type": "find.prev" },
    ".": { "type": "repeat.last" },
    "<S-Esc>": { "type": "addon.toggle.enabled" }
  },
  "search": {
    "default": "google",
    "engines": {
      "google": "https://google.com/search?q={}",
      "yahoo": "https://search.yahoo.com/search?p={}",
      "bing": "https://www.bing.com/search?q={}",
      "duckduckgo": "https://duckduckgo.com/?q={}",
      "twitter": "https://twitter.com/search?q={}",
      "wikipedia": "https://en.wikipedia.org/w/index.php?search={}"
    }
  },
  "properties": {
    "hintchars": "abcdefghijklmnopqrstuvwxyz",
    "smoothscroll": false,
    "complete": "sbh"
  },
  "blacklist": [
  ]
}`,
});
