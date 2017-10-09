# Vim Vixen

An Firefox add-ons works with WebExtensions, insipired by [Vimperator](https://github.com/vimperator).

## Background

### Firefox will stop supporting legacy add-ons

Firefox will support only add-ons using WebExtensions API since version 57, and
plugins based on legacy APIs will be unavailable.  Vim Vixen is new solution to
create Vim-like Firefox.

### Vimimum

[Vimium](https://github.com/philc/vimium) is a Chrome extension which able to
navigate pages in Google Chrome/Chromium.  Vimium also started to support on
Firefox by WebExtensions API.

## Basic usage

### Key-maps

The key-maps are configurable in preferences of the add-ons.
The default mapping are shown in the following.

#### Console

- `:`: open console
- `o`,`t`,`w`: open a page in current tab, new tab, or new window
- `O`,`T`,`W`: similar to `o`,`t`,`w`, but that contains current URL
- `b`: Select tabs by URL or title

#### Scrolling

- `k`,`k`: scroll vertically
- `h`,`l`: scroll horizontally
- `<C-U>`,`<C-D>`: scroll pages by half of screen
- `<C-B>`,`<C-F>`: scroll pages by a screen
- `0`,`$`: scroll a page to leftmost/rightmost
- `gg`,`G`: scroll to top/bottom

#### Tabs
- `d`: delete current tab
- `u`: reopen close tab
- `K`/`J`: select prev/next tab
- `r`: reload current tab
- `R`: reload current tab without cache

### Navigation
- `f`: start following links in the page
- `H`: go back in histories
- `L`: go forward in histories
- `[[`,`]]`: find  prev/next links and open it
- `gu`: go to parent directory
- `gU`: go to root directory

#### Misc
- `zi`,`zo`: zoom-in/zoom-out
- `zz`: Set default zoom level
- `y`: copy URL in current tab

### Console commands

Vim-Vixen provides a console likes Vimperator's one.
The console is opened by `:` key or keys to open console with initial value
likes `o`, `t`, or `w` keys.

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
