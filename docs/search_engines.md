---
title: Search engines
---

# Search engines

Vim Vixen supports searching with search engines such as Google and Yahoo.

You can configure search engines, including the default search engine, in the add-on's preferences.
The URLs specified in `"engines"` must contain a `{}`-placeholder, which will be
replaced with the search keyword parameters of the command.

```json
{
  "search": {
    "default": "google",
    "engines": {
      "google": "https://google.com/search?q={}",
      "yahoo": "https://search.yahoo.com/search?p={}",
      "bing": "https://www.bing.com/search?q={}",
      "duckduckgo": "https://duckduckgo.com/?q={}",
      "twitter": "https://twitter.com/search?q={}",
      "wikipedia": "https://en.wikipedia.org/w/index.php?search={}"
    }
  }
}
```
