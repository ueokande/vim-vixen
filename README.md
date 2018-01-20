# Vim Vixen

[![Join the chat room on Gitter for vim-vixen/vim-vixen](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vim-vixen/vim-vixen)
[![Build Status](https://travis-ci.org/ueokande/vim-vixen.svg?branch=kaizen)](https://travis-ci.org/ueokande/vim-vixen)
[![devDependencies Status](https://david-dm.org/ueokande/vim-vixen/dev-status.svg)](https://david-dm.org/ueokande/vim-vixen?type=dev)

Vim Vixen is a Firefox add-on which allows you to navigate with keyboard on the browser.
Firefox started to support WebExtensions API and will stop supporting add-ons using legacy APIs from version 57.
For this reason, many legacy add-ons do not work on Firefox 57.
Vim Vixen is a new choice for Vim users since Vim Vixen uses the WebExtensions API.

## Basic usage

### Key-maps

The key-maps are configurable in the add-ons preferences by navigating to `about:addons` and selecting "Extensions".
The default mappings are as follows:

#### Console

- <kbd>:</kbd>: open console
- <kbd>o</kbd>, <kbd>t</kbd>, <kbd>w</kbd>: open a page in current tab, new tab, or new window
- <kbd>O</kbd>, <kbd>T</kbd>, <kbd>W</kbd>: similar to <kbd>o</kbd>, <kbd>t</kbd>, <kbd>w</kbd>, but that contains current URL
- <kbd>b</kbd>: Select tabs by URL or title

#### Scrolling

- <kbd>j</kbd>, <kbd>k</kbd>: scroll vertically
- <kbd>h</kbd>, <kbd>l</kbd>: scroll horizontally
- <kbd>Ctrl</kbd>+<kbd>U</kbd>, <kbd>Ctrl</kbd>+<kbd>D</kbd>: scroll pages by half of screen
- <kbd>Ctrl</kbd>+<kbd>B</kbd>, <kbd>Ctrl</kbd>+<kbd>F</kbd>: scroll pages by a screen
- <kbd>0</kbd>, <kbd>$</kbd>: scroll a page to leftmost/rightmost
- <kbd>g</kbd><kbd>g</kbd>, <kbd>G</kbd>: scroll to top/bottom

#### Tabs
- <kbd>d</kbd>: delete current tab
- <kbd>!</kbd><kbd>d</kbd>: delete pinned tab
- <kbd>u</kbd>: reopen close tab
- <kbd>K</kbd>, <kbd>J</kbd>: select prev or next tab
- <kbd>g0</kbd>, <kbd>g$</kbd>: select first or last tab
- <kbd>Ctrl</kbd>+<kbd>6</kbd>: select previous selected tab
- <kbd>r</kbd>: reload current tab
- <kbd>R</kbd>: reload current tab without cache
- <kbd>zp</kbd>: toggle pin/unpin current tab
- <kbd>zd</kbd>: duplicate current tab

### Navigation
- <kbd>f</kbd>: start following links in the page
- <kbd>H</kbd>: go back in history
- <kbd>L</kbd>: go forward in history
- <kbd>[</kbd><kbd>[</kbd>, <kbd>]</kbd><kbd>]</kbd>: find  prev or next links and open it
- <kbd>g</kbd><kbd>u</kbd>: go to parent directory
- <kbd>g</kbd><kbd>U</kbd>: go to root directory
- <kbd>g</kbd><kbd>i</kbd>: focus first input

#### Misc
- <kbd>z</kbd><kbd>i</kbd>, <kbd>z</kbd><kbd>o</kbd>: zoom-in/zoom-out
- <kbd>z</kbd><kbd>z</kbd>: Set default zoom level
- <kbd>y</kbd>: copy URL in current tab
- <kbd>p</kbd>: open clipbord's URL in current tab
- <kbd>P</kbd>: open clipbord's URL in new tab
- <kbd>Shift</kbd>+<kbd>Esc</kbd>: enable or disable the add-on in current tab.

### Console commands

Vim Vixen provides a console for `ex`-style commands similar to Vimperator.

Open the console with <kbd>:</kbd>. Or start it with initial values using
<kbd>o</kbd>, <kbd>t</kbd>, or <kbd>w</kbd>.

#### `:open` command

The `:open` command operates two different ways, depending on the parameter.
When the parameter is a URL, that URL is opened in the current tab.

```
:open http://github.com/ueokande
```

Otherwise, the current tab will open a search page with the supplied string (defaults to Google).

```
:open How to contribute to Vim-Vixen
```

To use a search engine other than the default, specify which search engine to use as the first parameter.

```
:open yahoo How to contribute to Vim-Vixen
```

To adjust the search engine default and add/remove search engines, see the [search engines](#search-engines) section.

#### `:tabopen` command

Open a URL or search keywords by search engine in new tab.

#### `:winopen` command

Open a URL or search keywords by search engine in new window.

#### `:buffer` command

Select tabs by URL or title matched by keywords.

#### `:set` command

`:set` command can set properties on console.

##### `smoothscroll` property

Enable/disable smooth scroll.
```
:set smoothscroll   " enable smooth scroll
:set nosmoothscroll " disable smooth scroll
```

##### `hintchars` property

Set hint characters

```
:set hintchars=0123456789
```

### Search engines

Vim Vixen supports search by search engines like Google and Yahoo.

You can configure search engines, including the default search engine, in the add-ons preferences.
The URLs specified in `"engines"` must contain a {}-placeholder, which will be
replaced with the search keyword parameters of the command.

```json
{
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
  }
}
```

### Blacklist

The blacklist allows you to disable the plugin for certain pages by URL patterns.
For instance, when you describe `"*.slack.com"`, the plugin is disabled on any Slack rooms.
In addition, you can also specify path patterns, such as `"example.com/mail/*"`.

```json
{
  "blacklist": [
    "*.slack.com",
    "example.com/mail/*"
  ]
}
```

You can toggle Vim Vixen between disabled and enabled with `shift + Esc`.

## Licence

MIT
