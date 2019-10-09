---
title: Blacklist
---

# Blacklist

## Blacklist

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
