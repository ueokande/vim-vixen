# Vim Vixen

[![Greenkeeper badge](https://badges.greenkeeper.io/ueokande/vim-vixen.svg)](https://greenkeeper.io/)

[![Join the chat room on Gitter for vim-vixen/vim-vixen](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vim-vixen/vim-vixen)
[![CircleCI](https://circleci.com/gh/ueokande/vim-vixen.svg?style=svg)](https://circleci.com/gh/ueokande/vim-vixen)
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
- <kbd>a</kbd>: add current page to the bookmarks

See [console commands](#console-commands) section for more detailed description

#### Tabs
- <kbd>d</kbd>: delete tab
- <kbd>!</kbd><kbd>d</kbd>: delete pinned tab
- <kbd>u</kbd>: reopen close tab
- <kbd>r</kbd>: reload current tab
- <kbd>R</kbd>: reload current tab without cache
- <kbd>K</kbd> or <kbd>g</kbd><kbd>T</kbd>: select previous tab
- <kbd>J</kbd> or <kbd>g</kbd><kbd>t</kbd>: select next tab
- <kbd>g</kbd><kbd>0</kbd>: select first tab
- <kbd>g</kbd><kbd>$</kbd>: select last tab
- <kbd>Ctrl</kbd>+<kbd>6</kbd>: open previously selected tab
- <kbd>z</kbd><kbd>p</kbd>: pin tab
- <kbd>z</kbd><kbd>d</kbd>: duplicate tab

#### Scrolling

- <kbd>k</kbd>: scroll down
- <kbd>j</kbd>: scroll up
- <kbd>h</kbd>: scroll left
- <kbd>l</kbd>: scroll right
- <kbd>Ctrl</kbd>+<kbd>U</kbd>: scroll up for a half page
- <kbd>Ctrl</kbd>+<kbd>D</kbd>: scroll down for a half page
- <kbd>Ctrl</kbd>+<kbd>B</kbd>: scroll up for a whole page
- <kbd>Ctrl</kbd>+<kbd>F</kbd>: scroll down for a whole page
- <kbd>g</kbd><kbd>g</kbd>: scroll to top of a page
- <kbd>G</kbd>: scroll to bottom of a page
- <kbd>0</kbd>: scroll to the leftmost part of a page
- <kbd>$</kbd>: scroll to the rightmost part of a page

#### Zoom

- <kbd>z</kbd><kbd>i</kbd>: zoom in
- <kbd>z</kbd><kbd>o</kbd>: zoom out
- <kbd>z</kbd><kbd>z</kbd>: zoom neutral (reset)

#### Navigation

- <kbd>f</kbd>: start following links in the page in the current tab
- <kbd>F</kbd>: start following links in the page in new tabs
- <kbd>H</kbd>: go back in history
- <kbd>L</kbd>: go forward in history
- <kbd>[</kbd><kbd>[</kbd>, <kbd>]</kbd><kbd>]</kbd>: find  prev or next links and open it
- <kbd>g</kbd><kbd>u</kbd>: go to parent directory
- <kbd>g</kbd><kbd>U</kbd>: go to root directory
- <kbd>g</kbd><kbd>i</kbd>: focus first input

Plugin can be configured to follow links in new tabs in background instead of
switching to a new tab immediately. To do this you need to update config file:
change `"background"` property of `"follow.start"` action to true:
```json
{
    "keymaps": {
        "F": { "type": "follow.start", "newTab": true, "background": true },
    }
}
```

#### Misc

- <kbd>y</kbd>: copy URL in current tab
- <kbd>p</kbd>: open clipbord's URL in current tab
- <kbd>P</kbd>: open clipbord's URL in new tab
- <kbd>Shift</kbd>+<kbd>Esc</kbd>: enable or disable the add-on in current tab.
- <kbd>/</kbd>: start to find a keyword in the page
- <kbd>n</kbd>: find next keyword in the page
- <kbd>N</kbd>: find prev keyword in the page
- <kbd>g</kbd><kbd>f</kbd>: view page source

### Console commands

Vim Vixen provides a console for `ex`-style commands similar to Vimperator.

Open the console with <kbd>:</kbd>. Or start it with initial values using
<kbd>o</kbd>/<kbd>O</kbd>, <kbd>t</kbd>/<kbd>T</kbd>,
or <kbd>w</kbd>/<kbd>W</kbd>.

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

#### `:quit` command

Close the current tab.

#### `:bdelete` command

Close a certain tab.

You can add `!` at the end of the command to close tab even if it is pinned:

```
:bdelete!
```

#### `:bdeletes` command

Close tabs matches with keywords.

You can add `!` at the end of the command to close even pinned tabs:

```
:bdeletes!
```

#### `:winopen` command

Open a URL or search keywords by search engine in new window.

#### `:buffer` command

Select tabs by URL or title matched by keywords.

#### `:addbookmark` command

Create a bookmark from the current URL.

```
:addbookmark My bookmark title
```

The key map <kbd>a</kbd> is a contenient way to create a bookmark from the
current page. That shows `:addbookmark` with a title from the current page into
console.

#### `:set` command

`:set` command can temporary override properties using console. See
[properties](#properties) section for more detailed description of available
properties.

### Properties

Plugin supports configurable properties which can be configured in JSON
settings:

```json
{
   "properties": {
       "adjacenttab": false
   }
}
```

Properties can be temporary overwritten by `:set` command in console.

List of available properties you can find below:

#### `smoothscroll` property

Enable/disable smooth scroll.

```
:set smoothscroll   " enable smooth scroll
:set nosmoothscroll " disable smooth scroll
```

#### `hintchars` property

Set hint characters

```
:set hintchars=0123456789
```

#### `adjacenttab` property

Open a new tab on adjacent of the current tab.

```
:set noadjacenttab  " open a tab at last
:set adjacenttab    " open a tab adjacently
```

For developers and contributors: you can look at
[#303](https://github.com/ueokande/vim-vixen/pull/303) for more details about
properties implementation and usage.

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

You can toggle Vim Vixen between disabled and enabled with
<kbd>shift</kbd>+<kbd>Esc</kbd>.

## Licence

MIT
