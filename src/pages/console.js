import './console.scss';
import messages from 'content/messages';
import CompletionComponent from 'components/completion';
import ConsoleComponent from 'components/console';
import reducers from 'reducers';
import { createStore } from 'store';
import * as completionActions from 'actions/completion';

const store = createStore(reducers);
let completionComponent = null;
let consoleComponent = null;
let prevState = {};

window.addEventListener('load', () => {
  let wrapper = document.querySelector('#vimvixen-console-completion');
  completionComponent = new CompletionComponent(wrapper, store);

  consoleComponent = new ConsoleComponent(document.body, store);
});

store.subscribe(() => {
  completionComponent.update();

  let state = store.getState().completion;

  if (state.groupSelection >= 0) {
    let item = state.groups[state.groupSelection].items[state.itemSelection];
    consoleComponent.setCommandValue(item.content);
  } else if (state.groups.length > 0 &&
    JSON.stringify(prevState.groups) === JSON.stringify(state.groups)) {
    // Reset input only completion groups not changed (unselected an item in
    // completion) in order to avoid to override previous input
    consoleComponent.setCommandCompletionOrigin();
  }
  prevState = state;
});

browser.runtime.onMessage.addListener((action) => {
  if (action.type === messages.STATE_UPDATE) {
    let state = action.state.console;
    consoleComponent.update(state);
    store.dispatch(completionActions.setItems(state.completions));
  }
});
