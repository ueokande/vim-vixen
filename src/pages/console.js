import './console.scss';
import messages from '../content/messages';
import CompletionComponent from '../components/completion';
import ConsoleComponent from '../components/console';
import completionReducer from '../reducers/completion';
import * as store from '../store';
import * as completionActions from '../actions/completion';

const completionStore = store.createStore(completionReducer);
let completionComponent = null;
let consoleComponent = null;

window.addEventListener('load', () => {
  let wrapper = document.querySelector('#vimvixen-console-completion');
  completionComponent = new CompletionComponent(wrapper, completionStore);

  // TODO use root root store instead of completionStore
  consoleComponent = new ConsoleComponent(document.body, completionStore);
});

completionStore.subscribe(() => {
  completionComponent.update();

  let state = completionStore.getState();
  if (state.groupSelection >= 0) {
    let item = state.groups[state.groupSelection].items[state.itemSelection];
    consoleComponent.setCommandValue(item.content);
  } else if (state.groups.length > 0) {
    consoleComponent.setCommandCompletionOrigin();
  }
});

browser.runtime.onMessage.addListener((action) => {
  if (action.type === messages.STATE_UPDATE) {
    let state = action.state.console;
    consoleComponent.update(state);
    completionStore.dispatch(completionActions.setItems(state.completions));
  }
});
