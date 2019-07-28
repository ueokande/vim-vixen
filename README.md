# Vim Vixen

[![Greenkeeper badge](https://badges.greenkeeper.io/ueokande/vim-vixen.svg)](https://greenkeeper.io/)

[![Join the chat room on Gitter for vim-vixen/vim-vixen](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vim-vixen/vim-vixen)
[![CircleCI](https://circleci.com/gh/ueokande/vim-vixen.svg?style=svg)](https://circleci.com/gh/ueokande/vim-vixen)
[![devDependencies Status](https://david-dm.org/ueokande/vim-vixen/dev-status.svg)](https://david-dm.org/ueokande/vim-vixen?type=dev)

Vim Vixen is a Firefox add-on which allows you to easily navigate the web by
keyboard. Since version 57, Firefox has migrated to the WebExtensions API and
has dropped support for legacy add-ons. Vim Vixen is a new choice for Vim users
since it uses the WebExtensions API.

## Basic usage

### Keymaps

Keymaps are configurable in the add-on's preferences by navigating to `about:addons` and selecting "Extensions".
The default mappings are as follows:

#### Console

- <kbd>:</kbd>: open the console
- <kbd>o</kbd>, <kbd>t</kbd>, <kbd>w</kbd>: open a page in the current tab, a new tab, or new window
- <kbd>O</kbd>, <kbd>T</kbd>, <kbd>W</kbd>: similar to <kbd>o</kbd>, <kbd>t</kbd>, <kbd>w</kbd>, but using the current URL
- <kbd>b</kbd>: select tabs by URL or title
- <kbd>a</kbd>: add the current page to your bookmarks

See the [console commands](#console-commands) section for a more detailed description.

#### Tabs

- <kbd>d</kbd>: delete the current tab and select the tab to its right
- <kbd>D</kbd>: delete the current tab and select the tab to its left
- <kbd>!</kbd><kbd>d</kbd>: delete a pinned tab
- <kbd>u</kbd>: reopen a close tab
- <kbd>r</kbd>: reload the current tab
- <kbd>R</kbd>: reload the current tab, bypassing the cache
- <kbd>K</kbd> or <kbd>g</kbd><kbd>T</kbd>: select the previous tab
- <kbd>J</kbd> or <kbd>g</kbd><kbd>t</kbd>: select the next tab
- <kbd>g</kbd><kbd>0</kbd>: select the first tab
- <kbd>g</kbd><kbd>$</kbd>: select the last tab
- <kbd>Ctrl</kbd>+<kbd>6</kbd>: open the previously-selected tab
- <kbd>z</kbd><kbd>p</kbd>: pin the curent tab tab
- <kbd>z</kbd><kbd>d</kbd>: duplicate the current tab

#### Scrolling

- <kbd>k</kbd>: scroll up
- <kbd>j</kbd>: scroll down
- <kbd>h</kbd>: scroll left
- <kbd>l</kbd>: scroll right
- <kbd>Ctrl</kbd>+<kbd>U</kbd>: scroll up half a page
- <kbd>Ctrl</kbd>+<kbd>D</kbd>: scroll down half a page
- <kbd>Ctrl</kbd>+<kbd>B</kbd>: scroll up a page
- <kbd>Ctrl</kbd>+<kbd>F</kbd>: scroll down a page
- <kbd>g</kbd><kbd>g</kbd>: scroll to the top of a page
- <kbd>G</kbd>: scroll to the bottom of a page
- <kbd>0</kbd>: scroll to the leftmost part of a page
- <kbd>$</kbd>: scroll to the rightmost part of a page
- <kbd>m</kbd>: set a mark for the current position
- <kbd>'</kbd>: jump to a marked position

Lowercase marks (`[a-z]`) store the position of the current tab. Uppercase and
numeric marks (`[A-Z0-9]`) store the position and the tab.

#### Zoom

- <kbd>z</kbd><kbd>i</kbd>: zoom in
- <kbd>z</kbd><kbd>o</kbd>: zoom out
- <kbd>z</kbd><kbd>z</kbd>: zoom neutral (reset)

#### Navigation

- <kbd>f</kbd>: follow links in the page in the current tab
- <kbd>F</kbd>: follow links in the page in a new tab
- <kbd>H</kbd>: go back in history
- <kbd>L</kbd>: go forward in history
- <kbd>[</kbd><kbd>[</kbd>, <kbd>]</kbd><kbd>]</kbd>: find a link to the previous/next page and open it
- <kbd>g</kbd><kbd>u</kbd>: go to the parent directory
- <kbd>g</kbd><kbd>U</kbd>: go to the root directory
- <kbd>g</kbd><kbd>i</kbd>: focus the first input field

Vim Vixen can be configured to follow links opened in tabs in the background
instead of switching to a new tab immediately. To do this, you'll need to update
the config file: change the `"background"` property of the `"follow.start"`
action to `true`, e.g.:

```json
{
    "keymaps": {
        "F": { "type": "follow.start", "newTab": true, "background": true }
    }
}
```

#### Misc

- <kbd>y</kbd>: copy the URL of the current tab to the clipboard
- <kbd>p</kbd>: open the clipboard's URL in the current tab
- <kbd>P</kbd>: open the clipboard's URL in new tab
- <kbd>Shift</kbd>+<kbd>Esc</kbd>: enable or disable the add-on in the current tab
- <kbd>/</kbd>: start searching for text in the page
- <kbd>n</kbd>: find the next search result in the page
- <kbd>N</kbd>: find the previous search result in the page
- <kbd>g</kbd><kbd>f</kbd>: view the source of the current tab

### Console commands

Vim Vixen provides a console for `ex`-style commands, similar to Vimperator.

Open the console with <kbd>:</kbd>. Or populate it with initial values using
<kbd>o</kbd>/<kbd>O</kbd>, <kbd>t</kbd>/<kbd>T</kbd>, or
<kbd>w</kbd>/<kbd>W</kbd>.

#### `:open`

The `:open` command operates two different ways, depending on the parameter.
When the parameter is a URL, it's opened in the current tab.

```
:open http://github.com/ueokande
```

Otherwise, the current tab opens a search page with the supplied string (defaults to Google).

```
:open How to contribute to Vim-Vixen
```

To use a search engine other than the default, specify the search engine to use as the first parameter.

```
:open yahoo How to contribute to Vim-Vixen
```

To adjust the default search-engine and add/remove search engines, see the [search engines](#search-engines) section.

#### `:tabopen`

Open a URL or search-engine query in a new tab.

#### `:quit` or `:q`

Close the current tab.

#### `:quitall` or `:qa`

Close all tabs.

#### `:bdelete`

Close a certain tab.

You can add `!` to the end of the command to close a tab even if it is pinned:

```
:bdelete!
```

#### `:bdeletes`

Close tabs matching the specified keywords.

You can add `!` to the end of the command to close pinned tabs:

```
:bdeletes!
```

#### `:winopen`

Open a URL or search-engine query in a new window.

#### `:buffer`

Select tabs by URL or title keywords.

#### `:addbookmark`

Create a bookmark from the current URL.

```
:addbookmark My bookmark title
```

The keymap <kbd>a</kbd> is a convenient way to create a bookmark for the
current page. It populates the console with `:addbookmark` and the title of
the current page.

#### `:set`

The `:set` command can be used to temporarily override properties in the
console. See the [properties](#properties) section for more details on
the available properties.

### Properties

Vim Vixen can be configured by defining settings in a JSON document, e.g.:

```json
{
   "properties": {
       "complete": "sbh"
   }
}
```

Properties can be temporarily overridden by using the `:set` command in the
console.

The following properties are available:

#### `smoothscroll`

Enable/disable smooth scrolling.

```
:set smoothscroll   " enable smooth scrolling
:set nosmoothscroll " disable smooth scrolling
```

#### `hintchars`

Set hint characters.

```
:set hintchars=0123456789
```

#### `complete`

Set completion items on `open`, `tabopen`, and `winopen` commands.
The allowed value is character sequence of `s`, `b`, or `h`.
Hit <kbd>Tab</kbd> or <kbd>Shift</kbd>+<kbd>Tab</kbd> to select an item from the completion list.
Each character represents the following:

- `s`: search engines
- `b`: bookmark items
- `h`: history items.

```
:set complete=sbh
```

### Search engines

Vim Vixen supports searching with search engines such as Google and Yahoo.

You can configure search engines, including the default search engine, in the add-on's preferences.
The URLs specified in `"engines"` must contain a `{}`-placeholder, which will be
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
For instance, you could use `"*.slack.com"` to disable the plugin on all Slack channels.
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

## Compatibility

- Firefox 52+
- Firefox for Android
- Waterfox 56

## Copyright

Copyright © 2017-2019 by Shin'ya Ueoka

## Licence

MIT
