## Checklist for testing Vim Vixen

### Keybindings in JSON settings

Test operations with default key maps.

#### Scrolling

- [ ] <kbd>k</kbd>, <kbd>j</kbd>: scroll up and down
- [ ] <kbd>h</kbd>, <kbd>l</kbd>: scroll left and right
- [ ] <kbd>Ctrl</kbd>+<kbd>U</kbd>, <kbd>Ctrl</kbd>+<kbd>D</kbd>: scroll up and down by half of screen
- [ ] <kbd>Ctrl</kbd>+<kbd>B</kbd>, <kbd>Ctrl</kbd>+<kbd>F</kbd>: scroll up and down by a screen
- [ ] <kbd>0</kbd>, <kbd>$</kbd>: scroll to leftmost and rightmost
- [ ] <kbd>g</kbd><kbd>g</kbd>, <kbd>G</kbd>: scroll to top and bottom
- [ ] Smooth scroll by `:set smoothscroll`
- [ ] Non-smooth scroll by `:set nosmoothscroll`
- [ ] Configure custom hint character by settings `"smoothscroll": true`, `"smoothscroll": false`

#### Console

The behaviors of the console are tested in [Console section](#consoles).

- [ ] <kbd>:</kbd>: open empty console
- [ ] <kbd>o</kbd>, <kbd>t</kbd>, <kbd>w</kbd>: open a console with `open`, `tabopen`, `winopen`
- [ ] <kbd>O</kbd>, <kbd>T</kbd>, <kbd>W</kbd>: open a console with `open`, `tabopen`, `winopen` and current URL
- [ ] <kbd>b</kbd>: open a consolw with `buffer`

#### Tabs

- [ ] <kbd>d</kbd>: delete current tab, unable to remove pinnned tab
- [ ] <kbd>!d</kbd>: delete current tab and pinned tab
- [ ] <kbd>u</kbd>: reopen close tab
- [ ] <kbd>K</kbd>, <kbd>J</kbd>: select prev and next tab
- [ ] <kbd>g0</kbd>, <kbd>g$</kbd>: select first and last tab
- [ ] <kbd>r</kbd>: reload current tab
- [ ] <kbd>R</kbd>: reload current tab without cache
- [ ] <kbd>zd</kbd>: duplicate current tab
- [ ] <kbd>zp</kbd>: toggle pin/unpin state on current tab
- [ ] <kbd>Ctrl</kbd>+<kbd>6</kbd>: select previous selected tab

#### Navigation

- [ ] <kbd>H</kbd>, <kbd>L</kbd>: go back and forward in history
- [ ] <kbd>[</kbd><kbd>[</kbd>, <kbd>]</kbd><kbd>]</kbd>: Open next/prev link in `<link>` tags.
- [ ] <kbd>[</kbd><kbd>[</kbd>, <kbd>]</kbd><kbd>]</kbd>: find prev and next links and open it
- [ ] <kbd>g</kbd><kbd>u</kbd>: go to parent directory
- [ ] <kbd>g</kbd><kbd>U</kbd>: go to root directory

#### Misc

- [ ] <kbd>z</kbd><kbd>i</kbd>, <kbd>z</kbd><kbd>o</kbd>: zoom-in and zoom-out
- [ ] <kbd>z</kbd><kbd>z</kbd>: set zoom level as default
- [ ] <kbd>y</kbd>: yank current URL and show a message
- [ ] <kbd>p</kbd>: open clipbord's URL in current tab
- [ ] <kbd>P</kbd>: open clipbord's URL in new tab
- [ ] Toggle enabled/disabled of plugin bu <kbd>Shift</kbd>+<kbd>Esc</kbd>

### Following links

- [ ] <kbd>f</kbd>: start following links
- [ ] <kbd>F</kbd>: start following links and open in new tab
- [ ] open link with target='_blank' in new tab by <kbd>f</kbd>
- [ ] open link with target='_blank' in new tab by <kbd>F</kbd>
- [ ] Show hints on following on a page containing `<frame>`/`<iframe>`
- [ ] Show hints only inside viewport of the frame on following on a page containing `<frame>`/`<iframe>`
- [ ] Show hints only inside top window on following on a page containing `<frame>`/`<iframe>`
- [ ] Select link and open it in the frame in `<iframe>`/`<frame`> on following by <kbd>f</kbd>
- [ ] Select link and open it in new tab in `<iframe>`/`<frame`> on following by <kbd>F</kbd>
- [ ] Select link and open it in `<area>` tags, for <kbd>f</kbd> and <kbd>F</kbd>
- [ ] Configure custom hint character by `:set hintchars=012345678`
- [ ] Configure custom hint character by settings `"hintchars": "012345678"`

### Consoles

#### Exec a command

- [ ] `<EMPTY>`, `<SP>`: do nothing
<br>

- [ ] `open an apple`: search with keywords "an apple" by default search engine (google)
- [ ] `open github.com`: open github.com
- [ ] `open https://github.com`: open github.com
- [ ] `open yahoo an apple`: search with keywords "an apple" by yahoo.com
- [ ] `open yahoo`,`open yahoo<SP>`: search with empty keywords; yahoo redirects to top page
- [ ] `open`,`open<SP>`: open default search engine
<br>

- [ ] `tabopen`: do avobe tests replaced `open` with `tabopen`, and verify the page is opened in new tab
- [ ] `winopen`: do avobe tests replaced `open` with `winopen`, and verify the page is opened in new window
<br>

- [ ] `buffer`,`buffer<SP>`: do nothing
- [ ] `buffer <title>`, `buffer <url>`: select tab which has an title matched with
- [ ] `buffer 1`: select leftmost tab
- [ ] `buffer 0`, `buffer <a number more than count of tabs>`: shows an error
- [ ] select tabs rotationally when more than two tabs are matched

### Completions

#### History and search engines

- [ ] `open`: show no completions
- [ ] `open<SP>`: show all engines and some history items
- [ ] `open g`: complete search engines starts with `g` and matched with keywords `g`
- [ ] `open foo bar`: complete history items matched with keywords `foo` and `bar`
- [ ] also `tabopen` and `winopen`
- shortening commands such as `o` are not test in this release
- [ ] Show competions for `:open`/`:tabopen`/`:buffer` on opning just after closed

#### Buffer command

- [ ] `buffer`: show no completions
- [ ] `buffer<SP>`: show all opened tabs in completion
- [ ] `buffer x`: show tabs which has title and URL matches with `x`

#### Misc

- [ ] Select next item by <kbd>Tab</kbd> and previous item by <kbd>Shift</kbd>+<kbd>Tab</kbd>

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
- [ ] Tha pages is shown in https://pitchify.com/
- [ ] Open console in http://www.espncricinfo.com/

## Find mode

- [ ] open console with <kbd>/</kbd>
- [ ] highlight a word on <kbd>Enter</kbd> pressed in find console
- [ ] Search next/prev by <kbd>n</kbd>/<kbd>N</kbd>
- [ ] Wrap search by <kbd>n</kbd>/<kbd>N</kbd>
- [ ] Find with last keyword if keyword is empty

## Misc

- [ ] Work after plugin reload
- [ ] Work on `about:blank`
- [ ] Able to map `<A-Z>` key.
- [ ] Open file menu by <kbd>Alt</kbd>+<kbd>F</kbd> (Other than Mac OS)
