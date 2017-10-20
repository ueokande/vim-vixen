### Checklist for testing Vim Vixen

#### Operations

Test operations with default key maps.

##### Scrolling

- [ ] <kbd>k</kbd> or <kbd>Ctrl</kbd>+<kbd>Y</kbd>, <kbd>j</kbd> or <kbd>Ctrl</kbd>+<kbd>E</kbd>: scroll up and down
- [ ] <kbd>h</kbd>, <kbd>l</kbd>: scroll left and right
- [ ] <kbd>Ctrl</kbd>+<kbd>U</kbd>, <kbd>Ctrl</kbd>+<kbd>D</kbd>: scroll up and down by half of screen
- [ ] <kbd>Ctrl</kbd>+<kbd>B</kbd>, <kbd>Ctrl</kbd>+<kbd>F</kbd>: scroll up and down by a screen
- [ ] <kbd>0</kbd>, <kbd>$</kbd>: scroll to leftmost and rightmost
- [ ] <kbd>g</kbd><kbd>g</kbd>, <kbd>G</kbd>: scroll to top and bottom

##### Console

The behaviors of the console are tested in [Console section](#consoles).

- [ ] <kbd>:</kbd>: open empty console
- [ ] <kbd>o</kbd>, <kbd>t</kbd>, <kbd>w</kbd>: open a console with `open`, `tabopen`, `winopen`
- [ ] <kbd>O</kbd>, <kbd>T</kbd>, <kbd>W</kbd>: open a console with `open`, `tabopen`, `winopen` and current URL
- [ ] <kbd>b</kbd>: open a consolw with `buffer`

##### Tabs

- [ ] <kbd>d</kbd>: delete current tab
- [ ] <kbd>u</kbd>: reopen close tab
- [ ] <kbd>K</kbd>, <kbd>J</kbd>: select prev and next tab
- [ ] <kbd>r</kbd>: reload current tab
- [ ] <kbd>R</kbd>: reload current tab without cache

##### Navigation

- [ ] <kbd>f</kbd>: start following links
- [ ] <kbd>F</kbd>: start following links and open in new tab
- [ ] <kbd>H</kbd>, <kbd>L</kbd>: go back and forward in histories
- [ ] <kbd>[</kbd><kbd>[</kbd>, <kbd>]</kbd><kbd>]</kbd>: find prev and next links and open it
- [ ] <kbd>g</kbd><kbd>u</kbd>: go to parent directory
- [ ] <kbd>g</kbd><kbd>U</kbd>: go to root directory

##### Misc

- [ ] <kbd>z</kbd><kbd>i</kbd>, <kbd>z</kbd><kbd>o</kbd>: zoom-in and zoom-out
- [ ] <kbd>z</kbd><kbd>z</kbd>: set zoom level as default
- [ ] <kbd>y</kbd>: yank current URL and show a message

#### Consoles

##### Exec a command

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
- [ ] `buffer 0`, `buffer 99`: shows an error
- [ ] select tabs rotationally when more than two tabs are matched

#### Completions

##### History and search engines

- [ ] `open`: show no completions
- [ ] `open<SP>`: show all engines and some history items
- [ ] `open g`: complete search engines starts with `g` and matched with keywords `g`
- [ ] `open foo bar`: complete history items matched with keywords `foo` and `bar`
- [ ] also `tabopen` and `winopen`
- shortening commands such as `o` are not test in this release

##### Buffer command

- [ ] `buffer`: show no completions
- [ ] `buffer<SP>`: show all opened tabs in completion
- [ ] `buffer x`: show tabs which has title and URL matches with `x`

#### Settings

##### Validations

- [ ] show error on invalid json
- [ ] show error when top-level keys has keys other than `keymaps`, and `search`

##### `"keymaps"` section

- [ ] show error on unknown operation name in `"keymaps"`

##### `"search"` section

- validations in `"search"` section are not tested in this release

##### Updating

- [ ] changes are updated on textarea blure when no errors
- [ ] changes are not updated on textarea blure when errors occurs
- [ ] keymap settings are applied to open tabs without reload
- [ ] search settings are applied to open tabs without reload

#### Events are fired on Slack and Twitter (#54)

- [ ] Fucus text box on Twitter or Slack, press <kbd>j</kbd>, then <kbd>j</kbd> is typed in the box
- [ ] Focus the text box on Twitter or Slack on following mode

#### Multi frame support (#61)

- [ ] Show hints on following on a page containing `<frame>`/`<iframe>`
- [ ] Show hints only inside viewport of the frame on following on a page containing `<frame>`/`<iframe>`
- [ ] Show hints only inside top window on following on a page containing `<frame>`/`<iframe>`
- [ ] Select link and open it in the frame in `<iframe>`/`<frame`> on following by <kbd>f</kbd>
- [ ] Select link and open it in new tab in `<iframe>`/`<frame`> on following by <kbd>F</kbd>

#### Empty suggestion (#65)

- [ ] Show competions for `:open`/`:tabopen`/`:buffer` on console after closed
