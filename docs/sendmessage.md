---
title: SendMessage
---

# SendMessage

Vim Vixen can send messages to other add-ons to controll their functionality by keyboard, if they support. To use this feature, you need to specify `addon.sendmessage` as `type`, `extensionId` and `message` (this can be string or object) for keymaps.

Note that, currently this feature can be set only when using "Use plain JSON".

## Example

Following example enables to toggle collapsed state of [Tree Style Tab](https://addons.mozilla.org/firefox/addon/tree-style-tab/)'s active tab by pressing <kbd>zc</kbd>. This kind of API might be described in add-ons' web site, for example you can find Tree Style Tab's API reference [here](https://github.com/piroor/treestyletab/wiki/API-for-other-addons).

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

You may want to see [the Wiki page for the same feature on Gesturefy](https://twitter.com/tomo_ahm/status/1297849816907575296) for more example.

