import * as operations from './operations';
import * as PropertyDefs from './property-defs';

export type Keymaps = {[key: string]: operations.Operation};

export interface Search {
  default: string;
  engines: { [key: string]: string };
}

export interface Properties {
  hintchars: string;
  smoothscroll: boolean;
  complete: string;
}

export default interface Settings {
  keymaps: Keymaps;
  search: Search;
  properties: Properties;
  blacklist: string[];
}

const DefaultProperties: Properties = PropertyDefs.defs.reduce(
  (o: {[name: string]: PropertyDefs.Type}, def) => {
    o[def.name] = def.defaultValue;
    return o;
  }, {}) as Properties;


export const keymapsValueOf = (o: any): Keymaps => {
  return Object.keys(o).reduce((keymaps: Keymaps, key: string): Keymaps => {
    let op = operations.valueOf(o[key]);
    keymaps[key] = op;
    return keymaps;
  }, {});
};

export const searchValueOf = (o: any): Search => {
  if (typeof o.default !== 'string') {
    throw new TypeError('string field "default" not set"');
  }
  for (let name of Object.keys(o.engines)) {
    if ((/\s/).test(name)) {
      throw new TypeError(
        `While space in the search engine not allowed: "${name}"`);
    }
    let url = o.engines[name];
    if (typeof url !== 'string') {
      throw new TypeError('"engines" not an object of string');
    }
    let matches = url.match(/{}/g);
    if (matches === null) {
      throw new TypeError(`No {}-placeholders in URL of "${name}"`);
    } else if (matches.length > 1) {
      throw new TypeError(`Multiple {}-placeholders in URL of "${name}"`);
    }

  }
  if (!Object.prototype.hasOwnProperty.call(o.engines, o.default)) {
    throw new TypeError(`Default engine "${o.default}" not found`);
  }
  return {
    default: o.default as string,
    engines: { ...o.engines },
  };
};

export const propertiesValueOf = (o: any): Properties => {
  let defNames = new Set(PropertyDefs.defs.map(def => def.name));
  let unknownName = Object.keys(o).find(name => !defNames.has(name));
  if (unknownName) {
    throw new TypeError(`Unknown property name: "${unknownName}"`);
  }

  for (let def of PropertyDefs.defs) {
    if (!Object.prototype.hasOwnProperty.call(o, def.name)) {
      continue;
    }
    if (typeof o[def.name] !== def.type) {
      throw new TypeError(`property "${def.name}" is not ${def.type}`);
    }
  }
  return {
    ...DefaultProperties,
    ...o,
  };
};

export const blacklistValueOf = (o: any): string[] => {
  if (!Array.isArray(o)) {
    throw new TypeError(`"blacklist" is not an array of string`);
  }
  for (let x of o) {
    if (typeof x !== 'string') {
      throw new TypeError(`"blacklist" is not an array of string`);
    }
  }
  return o as string[];
};

export const valueOf = (o: any): Settings => {
  let settings = { ...DefaultSetting };
  for (let key of Object.keys(o)) {
    switch (key) {
    case 'keymaps':
      settings.keymaps = keymapsValueOf(o.keymaps);
      break;
    case 'search':
      settings.search = searchValueOf(o.search);
      break;
    case 'properties':
      settings.properties = propertiesValueOf(o.properties);
      break;
    case 'blacklist':
      settings.blacklist = blacklistValueOf(o.blacklist);
      break;
    default:
      throw new TypeError('unknown setting: ' + key);
    }
  }
  return settings;
};

export const DefaultSetting: Settings = {
  keymaps: {
    '0': { 'type': 'scroll.home' },
    ':': { 'type': 'command.show' },
    'o': { 'type': 'command.show.open', 'alter': false },
    'O': { 'type': 'command.show.open', 'alter': true },
    't': { 'type': 'command.show.tabopen', 'alter': false },
    'T': { 'type': 'command.show.tabopen', 'alter': true },
    'w': { 'type': 'command.show.winopen', 'alter': false },
    'W': { 'type': 'command.show.winopen', 'alter': true },
    'b': { 'type': 'command.show.buffer' },
    'a': { 'type': 'command.show.addbookmark', 'alter': true },
    'k': { 'type': 'scroll.vertically', 'count': -1 },
    'j': { 'type': 'scroll.vertically', 'count': 1 },
    'h': { 'type': 'scroll.horizonally', 'count': -1 },
    'l': { 'type': 'scroll.horizonally', 'count': 1 },
    '<C-U>': { 'type': 'scroll.pages', 'count': -0.5 },
    '<C-D>': { 'type': 'scroll.pages', 'count': 0.5 },
    '<C-B>': { 'type': 'scroll.pages', 'count': -1 },
    '<C-F>': { 'type': 'scroll.pages', 'count': 1 },
    'gg': { 'type': 'scroll.top' },
    'G': { 'type': 'scroll.bottom' },
    '$': { 'type': 'scroll.end' },
    'd': { 'type': 'tabs.close' },
    'D': { 'type': 'tabs.close.right' },
    '!d': { 'type': 'tabs.close.force' },
    'u': { 'type': 'tabs.reopen' },
    'K': { 'type': 'tabs.prev' },
    'J': { 'type': 'tabs.next' },
    'gT': { 'type': 'tabs.prev' },
    'gt': { 'type': 'tabs.next' },
    'g0': { 'type': 'tabs.first' },
    'g$': { 'type': 'tabs.last' },
    '<C-6>': { 'type': 'tabs.prevsel' },
    'r': { 'type': 'tabs.reload', 'cache': false },
    'R': { 'type': 'tabs.reload', 'cache': true },
    'zp': { 'type': 'tabs.pin.toggle' },
    'zd': { 'type': 'tabs.duplicate' },
    'zi': { 'type': 'zoom.in' },
    'zo': { 'type': 'zoom.out' },
    'zz': { 'type': 'zoom.neutral' },
    'f': { 'type': 'follow.start', 'newTab': false, 'background': false },
    'F': { 'type': 'follow.start', 'newTab': true, 'background': false },
    'm': { 'type': 'mark.set.prefix' },
    '\'': { 'type': 'mark.jump.prefix' },
    'H': { 'type': 'navigate.history.prev' },
    'L': { 'type': 'navigate.history.next' },
    '[[': { 'type': 'navigate.link.prev' },
    ']]': { 'type': 'navigate.link.next' },
    'gu': { 'type': 'navigate.parent' },
    'gU': { 'type': 'navigate.root' },
    'gi': { 'type': 'focus.input' },
    'gf': { 'type': 'page.source' },
    'gh': { 'type': 'page.home', 'newTab': false },
    'gH': { 'type': 'page.home', 'newTab': true },
    'y': { 'type': 'urls.yank' },
    'p': { 'type': 'urls.paste', 'newTab': false },
    'P': { 'type': 'urls.paste', 'newTab': true },
    '/': { 'type': 'find.start' },
    'n': { 'type': 'find.next' },
    'N': { 'type': 'find.prev' },
    '.': { 'type': 'repeat.last' },
    '<S-Esc>': { 'type': 'addon.toggle.enabled' }
  },
  search: {
    default: 'google',
    engines: {
      'google': 'https://google.com/search?q={}',
      'yahoo': 'https://search.yahoo.com/search?p={}',
      'bing': 'https://www.bing.com/search?q={}',
      'duckduckgo': 'https://duckduckgo.com/?q={}',
      'twitter': 'https://twitter.com/search?q={}',
      'wikipedia': 'https://en.wikipedia.org/w/index.php?search={}'
    }
  },
  properties: {
    hintchars: 'abcdefghijklmnopqrstuvwxyz',
    smoothscroll: false,
    complete: 'sbh'
  },
  blacklist: []
};
