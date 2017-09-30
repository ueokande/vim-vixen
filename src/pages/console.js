import './console.scss';
import messages from '../content/messages';
import CompletionComponent from '../components/completion';
import completionReducer from '../reducers/completion';
import * as store from '../store';
import * as completionActions from '../actions/completion';

const completionStore = store.createStore(completionReducer);
let completionComponent = null;

window.addEventListener('load', () => {
  let wrapper = document.querySelector('#vimvixen-console-completion');
  completionComponent = new CompletionComponent(wrapper, completionStore);
});

// TODO consider object-oriented
let prevValue = '';
let completionOrigin = '';
let prevState = {};

completionStore.subscribe(() => {
  completionComponent.update();

  let state = completionStore.getState();
  let input = window.document.querySelector('#vimvixen-console-command-input');

  if (state.groupSelection >= 0) {
    let item = state.groups[state.groupSelection].items[state.itemSelection];
    input.value = item.content;
  } else if (state.groups.length > 0) {
    input.value = completionOrigin;
  }
});

const handleBlur = () => {
  return browser.runtime.sendMessage({
    type: messages.CONSOLE_BLURRED,
  });
};

const handleKeydown = (e) => {
  let input = window.document.querySelector('#vimvixen-console-command-input');

  switch (e.keyCode) {
  case KeyboardEvent.DOM_VK_ESCAPE:
    return input.blur();
  case KeyboardEvent.DOM_VK_RETURN:
    return browser.runtime.sendMessage({
      type: messages.CONSOLE_ENTERED,
      text: e.target.value
    });
  case KeyboardEvent.DOM_VK_TAB:
    if (e.shiftKey) {
      completionStore.dispatch(completionActions.selectPrev());
    } else {
      completionStore.dispatch(completionActions.selectNext());
    }
    e.stopPropagation();
    e.preventDefault();
    break;
  }
};

const handleKeyup = (e) => {
  if (e.keyCode === KeyboardEvent.DOM_VK_TAB) {
    return;
  }
  if (e.target.value === prevValue) {
    return;
  }

  let input = window.document.querySelector('#vimvixen-console-command-input');
  completionOrigin = input.value;

  prevValue = e.target.value;
  return browser.runtime.sendMessage({
    type: messages.CONSOLE_CHANGEED,
    text: e.target.value
  });
};

window.addEventListener('load', () => {
  let input = window.document.querySelector('#vimvixen-console-command-input');
  input.addEventListener('blur', handleBlur);
  input.addEventListener('keydown', handleKeydown);
  input.addEventListener('keyup', handleKeyup);
});

const updateCompletions = (completions) => {
  completionStore.dispatch(completionActions.setItems(completions));
};

const update = (state) => {
  let error = window.document.querySelector('#vimvixen-console-error');
  let command = window.document.querySelector('#vimvixen-console-command');
  let input = window.document.querySelector('#vimvixen-console-command-input');

  error.style.display = state.errorShown ? 'block' : 'none';
  error.textContent = state.errorText;

  command.style.display = state.commandShown ? 'block' : 'none';
  if (state.commandShown && !prevState.commandShown) {
    input.value = state.commandText;
    input.focus();
  }
  if (JSON.stringify(state.completions) !==
    JSON.stringify(prevState.completions)) {
    updateCompletions(state.completions);
  }

  prevState = state;
};

browser.runtime.onMessage.addListener((action) => {
  if (action.type === messages.STATE_UPDATE) {
    return update(action.state.console);
  }
});

window.addEventListener('load', () => {
  let error = window.document.querySelector('#vimvixen-console-error');
  let command = window.document.querySelector('#vimvixen-console-command');
  error.style.display = 'none';
  command.style.display = 'none';
});
