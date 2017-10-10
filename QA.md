# Checklist for testing Vim Vixen

## Operations

Test operations with default key maps.

### Scrolling

- [ ] `k`,`j`,`<C-E>`,`<C-Y>`,`h`,`l`: scroll vertically and horizonally
- [ ] `<C-U>`,`<C-D>`: scroll up and down by a half of page
- [ ] `<C-B>`,`<C-F>`: scroll up and down by page
- [ ] `0`,`$`: scroll leftmost and rightmost
- [ ] `gg`:`G`: scroll to top and bottom

### Console opening

The behaviors of the console are tested in [Console section](#consoles).

#### Console

- [ ] `:`: open empty console
- [ ] `o`,`t`,`w`: open a console with `open`,`tabopen`,`winopen`
- [ ] `O`,`T`,`W`: open a console with `open`,`tabopen`,`winopen` and current URL
- [ ] `b`: open a consolw with `buffer`

#### Scrolling

- [ ] `k`/`<C-Y>`,`j`/`<C-E>`: scroll up and down
- [ ] `h`,`l`: scroll left and right
- [ ] `<C-U>`,`<C-D>`: scroll up and down by half of screen
- [ ] `<C-B>`,`<C-F>`: scroll up and down by a screen
- [ ] `0`,`$`: scroll to leftmost and rightmost
- [ ] `gg`,`G`: scroll to top and bottom

#### Tabs
- [ ] `d`: delete current tab
- [ ] `u`: reopen close tab
- [ ] `K`,`J`: select prev and next tab
- [ ] `r`: reload current tab
- [ ] `R`: reload current tab without cache

### Navigation
- `f`: start following links
- `F`: start following links and open in new tab
- `H`,`L`: go back and forward in histories
- `[[`,`]]`: find prev and next links and open it
- `gu`: go to parent directory
- `gU`: go to root directory

#### Misc
- [ ] `zi`,`zo`: zoom-in and zoom-out
- [ ] `zz`: set zoom level as default
- [ ] `y`: yank current URL and show a message

## Consoles

### Exec a command

- [ ] `<EMPTY>`,`<SP>`: do nothing


- [ ] `open an apple`: search with keywords "an apple" by default search engine (google)
- [ ] `open github.com`: open github.com
- [ ] `open https://github.com`: open github.com
- [ ] `open yahoo an apple`: search with keywords "an apple" by yahoo.com
- [ ] `open yahoo`,`open yahoo<SP>`: search with empty keywords; yahoo redirects to top page
- [ ] `open`,`open<SP>`: open default search engine


- [ ] `tabopen`: do avobe tests replaced `open` with `tabopen`, and verify the page is opened in new tab
- [ ] `winopen`: do avobe tests replaced `open` with `winopen`, and verify the page is opened in new window


- [ ] `buffer`,`buffer `: do nothing
- [ ] `buffer <title>`, `buffer <url>`: select tab which has an title matched with
- [ ] `buffer 1`: select leftmost tab
- [ ] `buffer 99`: select rightmost tab
- [ ] select tab matched with a title
- [ ] select tabs rotationally when more than two tabs are matched

### Completions

#### History and search engines

- [ ] `open`: show no completions
- [ ] `open<SP>`: show all engines and some history items
- [ ] `open g`: complete search engines starts with `g` and matched with keywords `g`
- [ ] `open foo bar`: complete history items matched with keywords `foo` and `bar`
- [ ] also `tabopen` and `winopen`
- [ ] shortening commands such as `o` are not test in this release

#### Buffer command

- [ ] `buffer`: show no completions
- [ ] `buffer<SP>`: show all opened tabs in completion
- [ ] `buffer x`: show tabs which has title and URL matches with `x`

## Settings

### Validations

- [ ] show error on invalid json
- [ ] show error when top-level keys has keys other than `keymaps`, and `search`

#### `"keymaps"` section

- [ ] show error on unknown operation name in `"keymaps"`

#### `"search"` section

- [ ] validations in `"search"` section are not tested in this release

### Updating

- [ ] changes are updated on textarea blure when no errors
- [ ] changes are not updated on textarea blure when errors occurs
- [ ] keymap settings are applied to open tabs without reload
- [ ] search settings are applied to open tabs without reload
