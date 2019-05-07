import * as findActions from '../../actions/find';
import * as messages from '../../../shared/messages';
import MessageListener from '../../MessageListener';

export default class FindComponent {
  private store: any;

  constructor(store: any) {
    this.store = store;

    new MessageListener().onWebMessage(this.onMessage.bind(this));
  }

  onMessage(message: messages.Message) {
    switch (message.type) {
    case messages.CONSOLE_ENTER_FIND:
      return this.start(message.text);
    case messages.FIND_NEXT:
      return this.next();
    case messages.FIND_PREV:
      return this.prev();
    }
  }

  start(text: string) {
    let state = this.store.getState().find;

    if (text.length === 0) {
      return this.store.dispatch(
        findActions.next(state.keyword as string, true));
    }
    return this.store.dispatch(findActions.next(text, true));
  }

  next() {
    let state = this.store.getState().find;
    return this.store.dispatch(
      findActions.next(state.keyword as string, false));
  }

  prev() {
    let state = this.store.getState().find;
    return this.store.dispatch(
      findActions.prev(state.keyword as string, false));
  }
}
