import './console.scss';
import messages from 'shared/messages';
import CompletionComponent from 'components/completion';
import ConsoleComponent from 'components/console';
import reducers from 'reducers';
import { createStore } from 'store';
import * as consoleActions from 'actions/console';

const store = createStore(reducers);
let completionComponent = null;
let consoleComponent = null;

window.addEventListener('load', () => {
  let wrapper = document.querySelector('#vimvixen-console-completion');
  completionComponent = new CompletionComponent(wrapper, store);

  consoleComponent = new ConsoleComponent(document.body, store);
});

store.subscribe(() => {
  completionComponent.update();
  consoleComponent.update();
});

browser.runtime.onMessage.addListener((action) => {
  switch (action.type) {
  case messages.CONSOLE_SHOW_COMMAND:
    return store.dispatch(consoleActions.showCommand(action.command));
  case messages.CONSOLE_SHOW_ERROR:
    return store.dispatch(consoleActions.showError(action.text));
  case messages.CONSOLE_HIDE:
    return store.dispatch(consoleActions.hide(action.command));
  }
});
