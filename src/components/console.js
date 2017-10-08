import messages from 'shared/messages';
import * as consoleActions from 'actions/console';

export default class ConsoleComponent {
  constructor(wrapper, store) {
    this.wrapper = wrapper;
    this.prevValue = '';
    this.prevState = {};
    this.completionOrigin = '';
    this.store = store;

    let doc = this.wrapper.ownerDocument;
    let input = doc.querySelector('#vimvixen-console-command-input');
    input.addEventListener('blur', this.onBlur.bind(this));
    input.addEventListener('keydown', this.onKeyDown.bind(this));
    input.addEventListener('keyup', this.onKeyUp.bind(this));

    this.hideCommand();
    this.hideError();
  }

  onBlur() {
    return browser.runtime.sendMessage({
      type: messages.CONSOLE_BLURRED,
    });
  }

  onKeyDown(e) {
    let doc = this.wrapper.ownerDocument;
    let input = doc.querySelector('#vimvixen-console-command-input');

    switch (e.keyCode) {
    case KeyboardEvent.DOM_VK_ESCAPE:
      return input.blur();
    case KeyboardEvent.DOM_VK_RETURN:
      return browser.runtime.sendMessage({
        type: messages.CONSOLE_ENTERED,
        text: e.target.value
      }).then(this.onBlur);
    case KeyboardEvent.DOM_VK_TAB:
      if (e.shiftKey) {
        this.store.dispatch(consoleActions.completionPrev());
      } else {
        this.store.dispatch(consoleActions.completionNext());
      }
      e.stopPropagation();
      e.preventDefault();
      break;
    }
  }

  onKeyUp(e) {
    if (e.keyCode === KeyboardEvent.DOM_VK_TAB) {
      return;
    }
    if (e.target.value === this.prevValue) {
      return;
    }

    let doc = this.wrapper.ownerDocument;
    let input = doc.querySelector('#vimvixen-console-command-input');
    this.completionOrigin = input.value;

    this.prevValue = e.target.value;
    return browser.runtime.sendMessage({
      type: messages.CONSOLE_QUERY_COMPLETIONS,
      text: e.target.value
    }).then((completions) => {
      this.store.dispatch(consoleActions.setCompletions(completions));
    });
  }

  update() {
    let state = this.store.getState().console;
    if (!this.prevState.commandShown && state.commandShown) {
      this.showCommand(state.commandText);
    } else if (!state.commandShown) {
      this.hideCommand();
    }

    if (state.errorShown) {
      this.setErrorText(state.errorText);
      this.showError();
    } else {
      this.hideError();
    }

    if (state.groupSelection >= 0 && state.itemSelection >= 0) {
      let group = state.completions[state.groupSelection];
      let item = group.items[state.itemSelection];
      this.setCommandValue(item.content);
    } else if (state.completions.length > 0 &&
      JSON.stringify(this.prevState.completions) ===
        JSON.stringify(state.completions)) {
      // Reset input only completion groups not changed (unselected an item in
      // completion) in order to avoid to override previous input
      this.setCommandCompletionOrigin();
    }

    this.prevState = state;
  }

  showCommand(text) {
    let doc = this.wrapper.ownerDocument;
    let command = doc.querySelector('#vimvixen-console-command');
    let input = doc.querySelector('#vimvixen-console-command-input');

    command.style.display = 'block';
    input.value = text;
    input.focus();
  }

  hideCommand() {
    let doc = this.wrapper.ownerDocument;
    let command = doc.querySelector('#vimvixen-console-command');
    command.style.display = 'none';
  }

  setCommandValue(value) {
    let doc = this.wrapper.ownerDocument;
    let input = doc.querySelector('#vimvixen-console-command-input');
    input.value = value;
  }

  setCommandCompletionOrigin() {
    let doc = this.wrapper.ownerDocument;
    let input = doc.querySelector('#vimvixen-console-command-input');
    input.value = this.completionOrigin;
  }

  setErrorText(text) {
    let doc = this.wrapper.ownerDocument;
    let error = doc.querySelector('#vimvixen-console-error');
    error.textContent = text;
  }

  showError() {
    let doc = this.wrapper.ownerDocument;
    let error = doc.querySelector('#vimvixen-console-error');
    error.style.display = 'block';
  }

  hideError() {
    let doc = this.wrapper.ownerDocument;
    let error = doc.querySelector('#vimvixen-console-error');
    error.style.display = 'none';
  }
}
