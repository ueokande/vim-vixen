import * as consoleActions from 'console/actions/console';

const inputShownMode = (state) => {
  return ['command', 'find'].includes(state.mode);
};

export default class ConsoleComponent {
  constructor(wrapper, store) {
    this.wrapper = wrapper;
    this.store = store;
    this.prevMode = '';
    this.timer = null;

    let doc = this.wrapper.ownerDocument;
    let input = doc.querySelector('#vimvixen-console-command-input');

    input.addEventListener('blur', this.onBlur.bind(this));
    input.addEventListener('keydown', this.onKeyDown.bind(this));
    input.addEventListener('input', this.onInput.bind(this));

    store.subscribe(() => {
      this.update();
    });
    this.update();
  }

  onBlur() {
    let state = this.store.getState();
    if (state.mode === 'command' || state.mode === 'find') {
      return this.store.dispatch(consoleActions.hideCommand());
    }
  }

  doEnter(e) {
    e.stopPropagation();
    e.preventDefault();

    let state = this.store.getState();
    let value = e.target.value;
    if (state.mode === 'command') {
      return this.store.dispatch(consoleActions.enterCommand(value));
    } else if (state.mode === 'find') {
      return this.store.dispatch(consoleActions.enterFind(value));
    }
  }

  selectNext(e) {
    this.store.dispatch(consoleActions.completionNext());
    e.stopPropagation();
    e.preventDefault();
  }

  selectPrev(e) {
    this.store.dispatch(consoleActions.completionPrev());
    e.stopPropagation();
    e.preventDefault();
  }

  onKeyDown(e) {
    if (e.keyCode === KeyboardEvent.DOM_VK_ESCAPE && e.ctrlKey) {
      this.store.dispatch(consoleActions.hideCommand());
    }
    clearTimeout(this.timer);
    switch (e.keyCode) {
    case KeyboardEvent.DOM_VK_ESCAPE:
      return this.store.dispatch(consoleActions.hideCommand());
    case KeyboardEvent.DOM_VK_RETURN:
      return this.doEnter(e);
    case KeyboardEvent.DOM_VK_TAB:
      if (e.shiftKey) {
        this.store.dispatch(consoleActions.completionPrev());
      } else {
        this.store.dispatch(consoleActions.completionNext());
      }
      e.stopPropagation();
      e.preventDefault();
      break;
    case KeyboardEvent.DOM_VK_OPEN_BRACKET:
      if (e.ctrlKey) {
        return this.store.dispatch(consoleActions.hideCommand());
      }
      break;
    case KeyboardEvent.DOM_VK_M:
      if (e.ctrlKey) {
        return this.doEnter(e);
      }
      break;
    case KeyboardEvent.DOM_VK_N:
      if (e.ctrlKey) {
        this.selectNext(e);
      }
      break;
    case KeyboardEvent.DOM_VK_P:
      if (e.ctrlKey) {
        this.selectPrev(e);
      }
      break;
    }
  }

  onInput(e) {
    let state = this.store.getState();
    let text = e.target.value;
    clearTimeout(this.timer);
    this.store.dispatch(consoleActions.setConsoleText(text));
    if (state.mode === 'command') {
        this.timer = setTimeout(function(_text, _this) {
            return function() { 
                _this.store.dispatch(consoleActions.getCompletions(_text));
            }
        }(text, this), 150);
    }
  }

  onInputShown(state) {
    let doc = this.wrapper.ownerDocument;
    let input = doc.querySelector('#vimvixen-console-command-input');

    input.focus();
    window.focus();

    if (state.mode === 'command') {
      let text = state.consoleText;
      input.value = text;
      this.store.dispatch(consoleActions.getCompletions(text));
    }
  }

  update() {
    let state = this.store.getState();

    this.updateMessage(state);
    this.updateCommand(state);
    this.updatePrompt(state);

    if (this.prevMode !== state.mode && inputShownMode(state)) {
      this.onInputShown(state);
    }
    this.prevMode = state.mode;
  }

  updateMessage(state) {
    let doc = this.wrapper.ownerDocument;
    let box = doc.querySelector('.vimvixen-console-message');
    let display = 'none';
    let classList = ['vimvixen-console-message'];

    if (state.mode === 'error' || state.mode === 'info') {
      display = 'block';
      classList.push('vimvixen-console-' + state.mode);
    }

    box.className = classList.join(' ');
    box.style.display = display;
    box.textContent = state.messageText;
  }

  updateCommand(state) {
    let doc = this.wrapper.ownerDocument;
    let command = doc.querySelector('#vimvixen-console-command');
    let input = doc.querySelector('#vimvixen-console-command-input');

    let display = 'none';
    if (inputShownMode(state)) {
      display = 'block';
    }

    command.style.display = display;
    input.value = state.consoleText;
  }

  updatePrompt(state) {
    let classList = ['vimvixen-console-command-prompt'];
    if (inputShownMode(state)) {
      classList.push('prompt-' + state.mode);
    }

    let doc = this.wrapper.ownerDocument;
    let ele = doc.querySelector('.vimvixen-console-command-prompt');
    ele.className = classList.join(' ');
  }
}
