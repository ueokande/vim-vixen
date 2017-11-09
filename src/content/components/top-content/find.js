import * as findActions from 'content/actions/find';
import messages from 'shared/messages';

export default class FindComponent {
  constructor(win, store) {
    this.win = win;
    this.store = store;

    messages.onMessage(this.onMessage.bind(this));
  }

  onMessage(message) {
    let state = this.store.getState().find;
    switch (message.type) {
    case messages.CONSOLE_ENTER_FIND:
      return this.store.dispatch(findActions.next(message.text));
    case messages.FIND_NEXT:
      return this.store.dispatch(findActions.next(state.keyword));
    case messages.FIND_PREV:
      return this.store.dispatch(findActions.prev(state.keyword));
    }
  }
}
