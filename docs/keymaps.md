---
title: Keymaps
---

# Keymaps

Keymaps are configurable in the add-on's preferences by navigating to `about:addons` and selecting "Extensions".
The default mappings are as follows:

## Console

- <kbd>:</kbd>: open the console
- <kbd>o</kbd>, <kbd>t</kbd>, <kbd>w</kbd>: open a page in the current tab, a new tab, or new window
- <kbd>O</kbd>, <kbd>T</kbd>, <kbd>W</kbd>: similar to <kbd>o</kbd>, <kbd>t</kbd>, <kbd>w</kbd>, but using the current URL
- <kbd>b</kbd>: select tabs by URL or title
- <kbd>a</kbd>: add the current page to your bookmarks

See the [console commands](./console_commands.html) section for a more detailed description.

## Tabs

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

## Scrolling

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

## Zoom

- <kbd>z</kbd><kbd>i</kbd>: zoom in
- <kbd>z</kbd><kbd>o</kbd>: zoom out
- <kbd>z</kbd><kbd>z</kbd>: zoom neutral (reset)

## Navigation

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

## Misc

- <kbd>y</kbd>: copy the URL of the current tab to the clipboard
- <kbd>p</kbd>: open the clipboard's URL in the current tab
- <kbd>P</kbd>: open the clipboard's URL in new tab
- <kbd>Shift</kbd>+<kbd>Esc</kbd>: enable or disable the add-on in the current tab
- <kbd>/</kbd>: start searching for text in the page
- <kbd>n</kbd>: find the next search result in the page
- <kbd>N</kbd>: find the previous search result in the page
- <kbd>g</kbd><kbd>f</kbd>: view the source of the current tab


