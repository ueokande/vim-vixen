import * as messages from '../../../shared/messages';
import MessageListener from '../../MessageListener';

import FindUseCase from '../../usecases/FindUseCase';

let findUseCase = new FindUseCase();

export default class FindComponent {
  constructor() {
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
    return Promise.resolve();
  }

  start(text: string) {
    return findUseCase.startFind(text.length === 0 ? null : text);
  }

  next() {
    return findUseCase.findNext();
  }

  prev() {
    return findUseCase.findPrev();
  }
}
