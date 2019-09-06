---
title: Properties
---

# Properties

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

## `smoothscroll`

Enable/disable smooth scrolling.

```
:set smoothscroll   " enable smooth scrolling
:set nosmoothscroll " disable smooth scrolling
```

## `hintchars`

Set hint characters.

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
