import CommonComponent from '../common';
import FollowController from './follow-controller';
import FindComponent from './find';
import ConsoleComponent from './console';
import messages from 'shared/messages';
import * as scrolls from 'content/scrolls';
import Preact from 'preact';
import { Provider } from 'preact-redux';

export default class TopContent {

  constructor(win, store) {
    this.win = win;
    this.store = store;

    new CommonComponent(win, store); // eslint-disable-line no-new
    new FollowController(win, store); // eslint-disable-line no-new
    new FindComponent(win, store); // eslint-disable-line no-new

    let provider = Preact.h(
      Provider, { store: store },
      Preact.h(ConsoleComponent),
    );

    Preact.render(provider, win.document.body);

    messages.onMessage(this.onMessage.bind(this));
  }

  onMessage(message) {
    let addonState = this.store.getState().addon;

    switch (message.type) {
    case messages.CONSOLE_UNFOCUS:
      return Promise.resolve();
    case messages.ADDON_ENABLED_QUERY:
      return Promise.resolve({
        type: messages.ADDON_ENABLED_RESPONSE,
        enabled: addonState.enabled,
      });
    case messages.TAB_SCROLL_TO:
      return scrolls.scrollTo(message.x, message.y, false);
    }
  }
}
