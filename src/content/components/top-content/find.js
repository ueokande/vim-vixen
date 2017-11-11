import * as findActions from 'content/actions/find';
import messages from 'shared/messages';
import * as consoleFrames from '../../console-frames';

export default class FindComponent {
  constructor(win, store) {
    this.win = win;
    this.store = store;

    messages.onMessage(this.onMessage.bind(this));
  }

  onMessage(message) {
    switch (message.type) {
    case messages.CONSOLE_ENTER_FIND:
      return this.start(message.text);
    case messages.FIND_NEXT:
      return this.next();
    case messages.FIND_PREV:
      return this.prev();
    }
  }

  start(text) {
    let state = this.store.getState().find;

    if (text.length === 0) {
      return this.store.dispatch(findActions.next(state.keyword, true));
    }
    return this.store.dispatch(findActions.next(text, true));
  }

  next() {
    let state = this.store.getState().find;

    if (!state.found) {
      return consoleFrames.postError(
        window.document,
        'Pattern not found: ' + state.keyword);
    }
    return this.store.dispatch(findActions.next(state.keyword, false));
  }

  prev() {
    let state = this.store.getState().find;

    if (!state.found) {
      return consoleFrames.postError(
        window.document,
        'Pattern not found: ' + state.keyword);
    }
    return this.store.dispatch(findActions.prev(state.keyword, false));
  }
}
