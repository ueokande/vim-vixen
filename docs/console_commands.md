---
title: Console commands
---

# Console commands

Vim Vixen provides a console for `ex`-style commands, similar to Vimperator.

Open the console with <kbd>:</kbd>. Or populate it with initial values using
<kbd>o</kbd>/<kbd>O</kbd>, <kbd>t</kbd>/<kbd>T</kbd>, or
<kbd>w</kbd>/<kbd>W</kbd>.

## `:open`

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

To adjust the default search-engine and add/remove search engines, see the [search engines](./search_engines.html) section.

## `:tabopen`

Open a URL or search-engine query in a new tab.

## `:quit` or `:q`

Close the current tab.

## `:quitall` or `:qa`

Close all tabs.

## `:bdelete`

Close a certain tab.

You can add `!` to the end of the command to close a tab even if it is pinned:

```
:bdelete!
```

## `:bdeletes`

Close tabs matching the specified keywords.

You can add `!` to the end of the command to close pinned tabs:

```
:bdeletes!
```

## `:winopen`

Open a URL or search-engine query in a new window.

## `:buffer`

Select tabs by URL or title keywords.

## `:addbookmark`

Create a bookmark from the current URL.

```
:addbookmark My bookmark title
```

The keymap <kbd>a</kbd> is a convenient way to create a bookmark for the
current page. It populates the console with `:addbookmark` and the title of
the current page.

## `:set`

The `:set` command can be used to temporarily override properties in the
console. See the [properties](./properties.html) section for more details on
the available properties.
