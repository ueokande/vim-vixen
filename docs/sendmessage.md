---
title: Send Message
---

# Send Message

Vim Vixen can send messages to other add-on.

Note that, currently this feature can be set only when using "Use plain JSON".

## Example

Following example enables to toggle collapsed state of [Tree Style Tab]()'s active tab by pressing <kbd>zc</kbd>. You can find complete API reference on [Tree Style Tab's API reference](https://github.com/piroor/treestyletab/wiki/API-for-other-addons).

```json
{
    "keymaps": {
        "zc": {
          "type": "addon.sendmessage",
          "extensionId": "treestyletab@piro.sakura.ne.jp",
          "message": {
            "type": "toggle-tree-collapsed",
            "tab": "active"
            }
        }
    }
}
```

## Misc

You may want to see [Wiki page for the same function on Gesturefy](https://twitter.com/tomo_ahm/status/1297849816907575296).

