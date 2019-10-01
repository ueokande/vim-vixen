---
title: Blacklist
---

# Blacklist

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
