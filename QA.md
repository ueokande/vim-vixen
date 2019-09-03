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

#### Form Settings

##### `"blacklist"` section

- [ ] `github.com/a` blocks `github.com/a`, and not blocks `github.com/aa`

##### Updating

- [ ] keymap settings are applied to open tabs without reload
- [ ] search settings are applied to open tabs without reload

## Find mode

- [ ] open console with <kbd>/</kbd>
- [ ] highlight a word on <kbd>Enter</kbd> pressed in find console
- [ ] Search next/prev by <kbd>n</kbd>/<kbd>N</kbd>
- [ ] Wrap search by <kbd>n</kbd>/<kbd>N</kbd>
- [ ] Find with last keyword if keyword is empty
- [ ] Find keyword last used on new tab opened
