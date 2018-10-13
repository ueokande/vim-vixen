## Checklist for testing Vim Vixen

### Keybindings in JSON settings

Test operations with default key maps.

#### Scrolling

- [ ] Smooth scroll by `:set smoothscroll`
- [ ] Non-smooth scroll by `:set nosmoothscroll`
- [ ] Configure custom hint character by settings `"smoothscroll": true`, `"smoothscroll": false`

#### Console

The behaviors of the console are tested in [Console section](#consoles).

- [ ] <kbd>:</kbd>: open empty console
- [ ] <kbd>o</kbd>, <kbd>t</kbd>, <kbd>w</kbd>: open a console with `open`, `tabopen`, `winopen`
- [ ] <kbd>O</kbd>, <kbd>T</kbd>, <kbd>W</kbd>: open a console with `open`, `tabopen`, `winopen` and current URL
- [ ] <kbd>b</kbd>: open a console with `buffer`
- [ ] <kbd>a</kbd>: open a console with `addbookmark` and the current page's title

#### Tabs

- [ ] <kbd>r</kbd>: reload current tab
- [ ] <kbd>R</kbd>: reload current tab without cache

#### Misc

- [ ] <kbd>y</kbd>: yank current URL and show a message
- [ ] <kbd>p</kbd>: open clipboard's URL in current tab
- [ ] <kbd>P</kbd>: open clipboard's URL in new tab
- [ ] <kbd>p</kbd>: search clipboard's keywords in current tab
- [ ] <kbd>P</kbd>: search clipboard's keywords in new tab
- [ ] Toggle enabled/disabled of plugin bu <kbd>Shift</kbd>+<kbd>Esc</kbd>
- [ ] Hide error and info console by <kbd>Esc</kbd>
- [ ] Vim-Vixen icons changes on <kbd>Shift</kbd>+<kbd>Esc</kbd>
- [ ] Add-on is enabled and disabled by clicking the indicator on the tool bar.
- [ ] The indicator changed on selected tab changed (changes add-on enabled)
- [ ] Notify to users on add-on updated at first time.

### Following links

- [ ] Show hints on following on a page containing `<frame>`/`<iframe>`
- [ ] Show hints only inside viewport of the frame on following on a page containing `<frame>`/`<iframe>`
- [ ] Show hints only inside top window on following on a page containing `<frame>`/`<iframe>`
- [ ] Select link and open it in the frame in `<iframe>`/`<frame`> on following by <kbd>f</kbd>
- [ ] Select link and open it in new tab in `<iframe>`/`<frame`> on following by <kbd>F</kbd>
- [ ] Select link and open it in `<area>` tags, for <kbd>f</kbd> and <kbd>F</kbd>
- [ ] Open new tab in background by `"background": true`
- [ ] Configure custom hint character by `:set hintchars=012345678`
- [ ] Configure custom hint character by settings `"hintchars": "012345678"` in add-on preferences
- [ ] Opened tabs is in child on Tree Style Tab

### Consoles

#### Exec a command

- [ ] `<EMPTY>`: do nothing
<br>

- [ ] `open an apple`: search with keywords "an apple" by default search engine (google)
- [ ] `open github.com`: open github.com
- [ ] `open https://github.com`: open github.com
- [ ] `open yahoo an apple`: search with keywords "an apple" by yahoo.com
- [ ] `open yahoo`: search with empty keywords; yahoo redirects to top page
- [ ] `open`: open default search engine
<br>

- [ ] `tabopen`: do above tests replaced `open` with `tabopen`, and verify the page is opened in new tab
- [ ] `winopen`: do above tests replaced `open` with `winopen`, and verify the page is opened in new window
<br>

- [ ] `buffer`: do nothing
- [ ] `buffer <title>`, `buffer <url>`: select tab which has an title matched with
- [ ] `buffer 1`: select leftmost tab
- [ ] `buffer 0`, `buffer <a number more than count of tabs>`: shows an error
- [ ] select tabs rotationally when more than two tabs are matched
- [ ] `buffer %`: select current tab (nothing to do)
- [ ] `buffer #`: select last selected tab
<br>

- [ ] `addbookmark` creates a bookmark
<br>

- [ ] `q`, `quit`: close current tab
- [ ] `qa`, `quitall`: close all tabs
- [ ] `bdelete`: delete a not-pinned tab matches with keywords
- [ ] `bdelete`: show errors no-tabs or more than 1 tabs matched
- [ ] `bdelete`: can not delete pinned tab
- [ ] `bdelete!`: delete a tab matches with keywords
- [ ] `bdelete!`: delete a pinned tab matches with keywords
- [ ] `bdeletes`: delete tabs with matched with keywords excluding pinned
- [ ] `bdeletes!`: delete tabs with matched with keywords including pinned

### Completions

#### History and search engines

- [ ] `open<SP>`: show all engines and some history items
- [ ] `open g`: complete search engines starts with `g` and matched with keywords `g`
- [ ] `open foo bar`: complete history items matched with keywords `foo` and `bar`
- [ ] `set `: show prperties starts with keywords
- [ ] The completions shows histories, search engines, and bookmarks.
- [ ] also `tabopen` and `winopen`
- shortening commands such as `o` are not test in this release
- [ ] Complete commands matched with input keywords in the prefix.

#### Buffer command

- [ ] `buffer<SP>`: show all opened tabs in completion
- [ ] `buffer x`: show tabs which has title and URL matches with `x`
- [ ] shows tab index and marks

#### Buffer command

- [ ] `bdelete`, `bdeletes`: show tabs excluding pinned tabs
- [ ] `bdelete!`, `bdeletes!`: show tabs including pinned tabs

#### Misc

- [ ] Select next item by <kbd>Tab</kbd> and previous item by <kbd>Shift</kbd>+<kbd>Tab</kbd>
- [ ] Reopen tab on *only current window* by <kbd>u</kbd>

### Settings

#### JSON Settings

##### Validations

- [ ] show error on invalid json
- [ ] show error when top-level keys has keys other than `keymaps`, `search`, `blacklist`, and `properties`

###### `"keymaps"` section

- [ ] show error on unknown operation name in `"keymaps"`

###### `"search"` section

- validations in `"search"` section are not tested in this release

##### `"blacklist"` section

- [ ] `github.com/a` blocks `github.com/a`, and not blocks `github.com/aa`
- [ ] `github.com/a*` blocks both `github.com/a` and `github.com/aa`
- [ ] `github.com/` blocks `github.com/`, and not blocks `github.com/a`
- [ ] `github.com` blocks both `github.com/` and `github.com/a`
- [ ] `*.github.com` blocks `gist.github.com/`, and not `github.com`

##### Updating

- [ ] changes are updated on textarea blure when no errors
- [ ] changes are not updated on textarea blure when errors occurs
- [ ] keymap settings are applied to open tabs without reload
- [ ] search settings are applied to open tabs without reload

##### Properties

- [ ] show errors when invalid property name
- [ ] show errors when invalid property type

#### Form Settings

<!-- validation on form settings does not implement in 0.7 -->

##### Search Engines

- [ ] able to change default
- [ ] able to remove item
- [ ] able to add item

##### `"blacklist"` section

- [ ] able to add item
- [ ] able to remove item
- [ ] `github.com/a` blocks `github.com/a`, and not blocks `github.com/aa`
- [ ] `github.com/a*` blocks both `github.com/a` and `github.com/aa`
- [ ] `github.com/` blocks `github.com/`, and not blocks `github.com/a`
- [ ] `github.com` blocks both `github.com/` and `github.com/a`
- [ ] `*.github.com` blocks `gist.github.com/`, and not `github.com`

##### Updating

- [ ] keymap settings are applied to open tabs without reload
- [ ] search settings are applied to open tabs without reload

### Settings source

- [ ] show confirmation dialog on switched from json to form
- [ ] state is saved on source changed
- [ ] on switching form -> json -> form, first and last form setting is equivalent to first one

### For certain sites

- [ ] scroll on Hacker News
- [ ] able to scroll on Gmail and Slack
- [ ] Focus text box on Twitter or Slack, press <kbd>j</kbd>, then <kbd>j</kbd> is typed in the box
- [ ] Focus the text box on Twitter or Slack on following mode
- [ ] The pages is shown in https://pitchify.com/
- [ ] Open console in http://www.espncricinfo.com/

## Find mode

- [ ] open console with <kbd>/</kbd>
- [ ] highlight a word on <kbd>Enter</kbd> pressed in find console
- [ ] Search next/prev by <kbd>n</kbd>/<kbd>N</kbd>
- [ ] Wrap search by <kbd>n</kbd>/<kbd>N</kbd>
- [ ] Find with last keyword if keyword is empty
- [ ] Find keyword last used on new tab opened

## Misc

- [ ] Work on `about:blank`
- [ ] Able to map `<A-Z>` key.
- [ ] Open file menu by <kbd>Alt</kbd>+<kbd>F</kbd> (Other than Mac OS)
