---
title: Blacklist
---

# Blacklist

## Blacklist

The blacklist allows you to disable the plugin for certain pages by URL patterns.
For instance, `"*.slack.com"` blocks the add-on on any Slack channels.
It also allows you to disable on localhost by `localhost:8000` (port is necessary).

You can also specify path patterns to disable sites on the URL matched with the patterns.

```json
{
  "blacklist": [
    "*.slack.com",
    "localhost:8000",
    "example.com/mail/*"
  ]
}
```

You can toggle Vim Vixen between disabled and enabled with <kbd>shift</kbd>+<kbd>Esc</kbd>.

## Partial Blacklist

The partial blacklist disables certain keys for each webpage separately.
This is enabled by describing object with `"url"` and `"keys"` instead of a string in the blacklist.
To disable <kbd>j</kbd> and <kbd>k</kbd> keys (scroll down and up) on github.com as an example, describe target url and disabled keys as the following:

```json
{
  "blacklist" [
    { "url": "github.com", "keys": ["j", "k"] }
  ]
}
```

The partial blacklist blocks all operations starting with the keys but not exactly-matched.
That means if the g described in "keys" field, it block all operation starting with <kbd>g</kbd>, such as <kbd>g</kbd><kbd>g</kbd>, <kbd>g</kbd><kbd>t</kbd>, and <kbd>g</kbd><kbd>T</kbd>.
