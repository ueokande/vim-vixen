import './site.scss';
import messages from 'shared/messages';
import CompletionComponent from 'console/components/completion';
import ConsoleComponent from 'console/components/console';
import reducers from 'console/reducers';
import { createStore } from 'shared/store';
import * as consoleActions from 'console/actions/console';

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
  case messages.CONSOLE_HIDE_COMMAND:
    return store.dispatch(consoleActions.hideCommand());
  }
});
