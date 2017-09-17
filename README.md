# Vim Vixen

An Firefox add-ons works with WebExtensions, insipired by [Vimperator](https://github.com/vimperator).

## Background

### Firefox will stop supporting legacy add-ons

Firefox will support only add-ons using WebExtensions API since version 57, and
plugins based on legacy APIs will be unavailable.  Vim Vixen is new solution to
create Vim-like Firefox.

### Vimimum

[Vimium](https://github.com/philc/vimium) is a Chrome extension which able to
navigate pages in Google Chrome/Chromium.  Vimium also started to suppprt on
Firefox by WebExtensions API.

## TODO

- [ ] open command
  - [x] open a link
  - [ ] search by keywords with engined
  - [ ] complete URLs from history
  - [ ] complete keywords for search
- [x] tabs navigation
  - [x] select a tabs by keyboard
  - [x] close/reopen a tab
  - [x] reload a page
- [ ] buffer control
  - [x] select a tab by :buffer command
  - [x] buffer completion
  - [ ] list buffers
  - [ ] select buffer last selected
- [ ] discover a content
  - [x] scroll a page by keyboard
  - [x] zoom-in/zoom-out
  - [ ] find a keyword in the page
- [ ] navigations
  - [ ] yank/paste page
  - [x] pagenation
  - [ ] open parent page
- [ ] hints
  - [x] open a link
  - [ ] open a link in new tab
  - [ ] activate input form
- [ ] misc
  - [ ] configurable keymaps
  - [ ] .rc file
  - [ ] other commands in Ex mode
- [ ] supporting Google Chrome/Chromium

## Licence

MIT
