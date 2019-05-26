## Checklist for testing Vim Vixen

### Keybindings in JSON settings

Test operations with default key maps.

#### Console

The behaviors of the console are tested in [Console section](#consoles).

#### Misc

- [ ] Toggle enabled/disabled of plugin bu <kbd>Shift</kbd>+<kbd>Esc</kbd>
- [ ] Hide error and info console by <kbd>Esc</kbd>
- [ ] Vim-Vixen icons changes on <kbd>Shift</kbd>+<kbd>Esc</kbd>
- [ ] Add-on is enabled and disabled by clicking the indicator on the tool bar.
- [ ] The indicator changed on selected tab changed (changes add-on enabled)
- [ ] Notify to users on add-on updated at first time.
- [ ] Reopen tab on *only current window* by <kbd>u</kbd>

### Properties

- [ ] Toggle smooth scroll by `:set smoothscroll` and `:set nosmoothscroll`
- [ ] Configure smooth scroll by settings `"smoothscroll": true` and `"smoothscroll": false`

### Settings

#### JSON Settings

##### Validations

- [ ] show error on invalid json
- [ ] show error when top-level keys has keys other than `keymaps`, `search`, `blacklist`, and `properties`

###### `"keymaps"` section

- [ ] show error on unknown operation name in `"keymaps"`

###### `"search"` section

- validations in `"search"` section are not tested in this release

##### Updating

- [ ] changes are updated on textarea blure when no errors
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

##### Updating

- [ ] keymap settings are applied to open tabs without reload
- [ ] search settings are applied to open tabs without reload

### Settings source

- [ ] show confirmation dialog on switched from json to form
- [ ] state is saved on source changed
- [ ] on switching form -> json -> form, first and last form setting is equivalent to first one

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
