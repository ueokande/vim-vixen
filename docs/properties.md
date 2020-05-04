---
title: Properties
---

# Properties

Vim Vixen can be configured by defining settings in a JSON document, e.g.:

```json
{
   "properties": {
       "smoothscroll": true,
       "hintchars": "abcdefghijklmnopqrstuvwxyz",
       "complete": "sbh"
   }
}
```
If a property is not set, it will be used the default.
Properties can be temporarily overridden by using the `:set` command in the
console.

The following properties are available:

## `smoothscroll`

Enable/disable smooth scrolling.

```
:set smoothscroll   " enable smooth scrolling
:set nosmoothscroll " disable smooth scrolling
```

## `hintchars`

Set hint characters. They will be used to follow links in the page.

```
:set hintchars=0123456789
```

## `complete`

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

## `colorscheme`

Set color scheme on the console.  The allowed value is one of `light`, `dark`,
and `system` (default).  `light` and `dark` indicate the light-mode and
dark-mode are used in the console, respectively.  `system` indicate the
preferred color configured by system settings is used (see also
[prefers-color-scheme][]).

```
set colorscheme=system     " Use system settings
set colorscheme=light      " Light mode
set colorscheme=dark       " Dark mode
```

[prefers-color-scheme]: https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme
