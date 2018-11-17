import messages from 'shared/messages';
import reducers from 'console/reducers';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import * as consoleActions from 'console/actions/console';

import { Provider } from 'preact-redux';
import Console from './components/console';

import { render, h } from 'preact';

const store = createStore(
  reducers,
  applyMiddleware(promise),
);

window.addEventListener('load', () => {
  render(
    <Provider store={store} >
      <Console></Console>
    </Provider>,
    document.body);
});

const onMessage = (message) => {
  switch (message.type) {
  case messages.CONSOLE_SHOW_COMMAND:
    return store.dispatch(consoleActions.showCommand(message.command));
  case messages.CONSOLE_SHOW_FIND:
    return store.dispatch(consoleActions.showFind());
  case messages.CONSOLE_SHOW_ERROR:
    return store.dispatch(consoleActions.showError(message.text));
  case messages.CONSOLE_SHOW_INFO:
    return store.dispatch(consoleActions.showInfo(message.text));
  case messages.CONSOLE_HIDE:
    return store.dispatch(consoleActions.hide());
  }
};

browser.runtime.onMessage.addListener(onMessage);
window.addEventListener('message', (event) => {
  onMessage(JSON.parse(event.data));
}, false);
