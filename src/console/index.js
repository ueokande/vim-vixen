import './site.scss';
import messages from 'shared/messages';
import CompletionComponent from 'console/components/completion';
import ConsoleComponent from 'console/components/console';
import reducers from 'console/reducers';
import { createStore } from 'shared/store';
import * as consoleActions from 'console/actions/console';

const store = createStore(reducers);

window.addEventListener('load', () => {
  let wrapper = document.querySelector('#vimvixen-console-completion');
  new CompletionComponent(wrapper, store); // eslint-disable-line no-new
  new ConsoleComponent(document.body, store); // eslint-disable-line no-new
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
  }
};

browser.runtime.onMessage.addListener(onMessage);
window.addEventListener('message', (event) => {
  onMessage(JSON.parse(event.data));
}, false);
