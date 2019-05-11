import TopContentComponent from './components/top-content';
import FrameContentComponent from './components/frame-content';
import consoleFrameStyle from './site-style';
import { newStore } from './store';
import MessageListener from './MessageListener';
import FindController from './controllers/FindController';
import * as messages from '../shared/messages';

const store = newStore();

if (window.self === window.top) {
  new TopContentComponent(window, store); // eslint-disable-line no-new

  let findController = new FindController();
  new MessageListener().onWebMessage((message: messages.Message) => {
    switch (message.type) {
    case messages.CONSOLE_ENTER_FIND:
      return findController.start(message);
    case messages.FIND_NEXT:
      return findController.next(message);
    case messages.FIND_PREV:
      return findController.prev(message);
    }
    return undefined;
  });
} else {
  new FrameContentComponent(window, store); // eslint-disable-line no-new
}

let style = window.document.createElement('style');
style.textContent = consoleFrameStyle;
window.document.head.appendChild(style);
