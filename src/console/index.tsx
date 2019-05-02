import * as messages from '../shared/messages';
import reducers from './reducers';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import * as consoleActions from './actions/console';
import { Provider } from 'react-redux';
import Console from './components/Console';
import React from 'react';
import ReactDOM from 'react-dom';

const store = createStore(
  reducers,
  applyMiddleware(promise),
);

window.addEventListener('load', () => {
  let wrapper = document.getElementById('vimvixen-console');
  ReactDOM.render(
    <Provider store={store} >
      <Console></Console>
    </Provider>,
    wrapper);
});

const onMessage = (message: any): any => {
  let msg = messages.valueOf(message);
  switch (msg.type) {
  case messages.CONSOLE_SHOW_COMMAND:
    return store.dispatch(consoleActions.showCommand(msg.command));
  case messages.CONSOLE_SHOW_FIND:
    return store.dispatch(consoleActions.showFind());
  case messages.CONSOLE_SHOW_ERROR:
    return store.dispatch(consoleActions.showError(msg.text));
  case messages.CONSOLE_SHOW_INFO:
    return store.dispatch(consoleActions.showInfo(msg.text));
  case messages.CONSOLE_HIDE:
    return store.dispatch(consoleActions.hide());
  }
};

browser.runtime.onMessage.addListener(onMessage);
let port = browser.runtime.connect(undefined, { name: 'vimvixen-console' });
port.onMessage.addListener(onMessage);
