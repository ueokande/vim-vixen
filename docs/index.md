---
title: Vim Vixen
---

# Vim Vixen

Vim Vixen is a Firefox add-on which allows you to easily navigate the web by
keyboard. Since version 57, Firefox has migrated to the WebExtensions API and
has dropped support for legacy add-ons. Vim Vixen is a new choice for Vim users
since it uses the WebExtensions API.

## Getting started

### Install Vim Vixen

Vim Vixen is supported on Firefox 68 ESR.  Please install the latest version of stable ESR
from the [download page](https://www.mozilla.org/en-US/firefox/).
You can install Vim Vixen from [Firefox add-ons (addons.mozilla.org)][AMO], and
manage installed add-ons on Firefox preferences `about:preferences`.

### Quick start

After installation, you can control Firefox with vim-like keymaps.  To scroll a
page in the browser, press <kbd>k</kbd>, <kbd>j</kbd>, <kbd>h</kbd> and
<kbd>l</kbd> keys.  You can scroll to the top or the bottom of a page by
<kbd>g</kbd><kbd>g</kbd> and <kbd>G</kbd>.

To select a left and right of current tab, use <kbd>K</kbd> and <kbd>J</kbd>
respectively.  To close current tab, use <kbd>d</kbd> and to restore closed
tabs, use <kbd>u</kbd>.

To open a link, press <kbd>f</kbd> to enter the **follow mode** to select a
link.  Then you can select links by alphabetic keys.

See also [Keymaps](./keymaps.html) for more detailed of keymaps.

### Using commands

Vim Vixen supports command line to run commands that control tabs and opens a
tab.  To open command line, press <kbd>:</kbd>.

To open a tab with URL, use `open` command as the following:

```
:open https://github.com/ueokande/vimvixen
```

or search keywords with search engine (such as Google) like:

```
:open How to use Vim
```

You can see completed commands on [Console commands](./console_commands.html).

## Copyright

Copyright © 2017-2019 by Shin'ya Ueoka

[AMO]: https://addons.mozilla.org/en-US/firefox/addon/vim-vixen/
