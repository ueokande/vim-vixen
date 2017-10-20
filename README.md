# Vim Vixen

Vim Vixen is a Firefox add-on which allows you to navigate with keyboard on the browser.
Firefox started to support WebExtensions API and will stop supporting add-ons using legacy APIs from version 57.
For this reason, many legacy add-ons do not work on Firefox 57.
and Vim Vixen is a new choise for Vim users since Vim Vixen uses WebExtensions API

## Basic usage

### Key-maps

The key-maps are configurable in preferences of the add-ons.
The default mapping are shown in the following.

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
- <kbd>u</kbd>: reopen close tab
- <kbd>K</kbd>, <kbd>J</kbd>: select prev or next tab
- <kbd>r</kbd>: reload current tab
- <kbd>R</kbd>: reload current tab without cache

### Navigation
- <kbd>f</kbd>: start following links in the page
- <kbd>H</kbd>: go back in histories
- <kbd>L</kbd>: go forward in histories
- <kbd>[</kbd><kbd>[</kbd>, <kbd>]</kbd><kbd>]</kbd>: find  prev or next links and open it
- <kbd>g</kbd><kbd>u</kbd>: go to parent directory
- <kbd>g</kbd><kbd>U</kbd>: go to root directory

#### Misc
- <kbd>z</kbd><kbd>i</kbd>, <kbd>z</kbd><kbd>o</kbd>: zoom-in/zoom-out
- <kbd>z</kbd><kbd>z</kbd>: Set default zoom level
- <kbd>y</kbd>: copy URL in current tab

### Console commands

Vim-Vixen provides a console likes Vimperator's one.
The console is opened by <kbd>:</kbd> key or keys to open console with initial value
likes <kbd>o</kbd>, <kbd>t</kbd>, or <kbd>w</kbd> keys.

#### `:open` command

Open a URL or search keywords by search engine in current tab, 
When specified parameter is formatted in URL as following, URL is opened to current tab.

```
:open http://github.com/ueokande
```

If specified parameters are keywords as following, open new tab searched by the
keywords with search engines (default to Google).

```
:open How to contribute to Vim-Vixen
```

You can specify search engines in first parameter.
For the default of search engines, see [search engines](#search-engines) section.

```
:open yahoo How to contribute to Vim-Vixen
```


#### `:tabopen` command

Open a URL or search keywords by search engine in new tab.

#### `:winopen` command

Open a URL or search keywords by search engine in new window.

#### `:buffer` command

Select tabs by URL or title matched by keywords.

### Search engines

Vim-Vixen support to search by search engines such as google or yahoo.
But the engines are independent on browsers' because of there is a limitation of WebExtensions.

You can configure search engines and default search engine in preferences of the add-ons.
The URLs specified in `"engines"` must contain a {}-placeholder, which will
replaced with keywords in parameters of the command.

```json
{
  "keymaps": {
    "...": "..."
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
  }
}
```

## Licence

MIT
