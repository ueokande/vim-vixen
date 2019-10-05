import Keymaps from './settings/Keymaps';
import Search from './settings/Search';
import Properties from './settings/Properties';
import Blacklist from './settings/Blacklist';

export default interface Settings {
  keymaps: Keymaps;
  search: Search;
  properties: Properties;
  blacklist: Blacklist;
}

export const valueOf = (o: any): Settings => {
  let settings = { ...DefaultSetting };
  for (let key of Object.keys(o)) {
    switch (key) {
    case 'keymaps':
      settings.keymaps = Keymaps.fromJSON(o.keymaps);
      break;
    case 'search':
      settings.search = Search.fromJSON(o.search);
      break;
    case 'properties':
      settings.properties = Properties.fromJSON(o.properties);
      break;
    case 'blacklist':
      settings.blacklist = Blacklist.fromJSON(o.blacklist);
      break;
    default:
      throw new TypeError('unknown setting: ' + key);
    }
  }
  return settings;
};

export const toJSON = (settings: Settings): any => {
  return {
    keymaps: settings.keymaps.toJSON(),
    search: settings.search.toJSON(),
    properties: settings.properties.toJSON(),
    blacklist: settings.blacklist.toJSON(),
  };
};

export const DefaultSetting: Settings = {
  keymaps: Keymaps.fromJSON({
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
    'D': { 'type': 'tabs.close', 'select': 'left' },
    'x$': { 'type': 'tabs.close.right' },
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
  }),
  search: Search.fromJSON({
    default: 'google',
    engines: {
      'google': 'https://google.com/search?q={}',
      'yahoo': 'https://search.yahoo.com/search?p={}',
      'bing': 'https://www.bing.com/search?q={}',
      'duckduckgo': 'https://duckduckgo.com/?q={}',
      'twitter': 'https://twitter.com/search?q={}',
      'wikipedia': 'https://en.wikipedia.org/w/index.php?search={}'
    }
  }),
  properties: Properties.fromJSON({
    hintchars: 'abcdefghijklmnopqrstuvwxyz',
    smoothscroll: false,
    complete: 'sbh'
  }),
  blacklist: Blacklist.fromJSON([]),
};
