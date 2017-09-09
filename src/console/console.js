import './console.scss';
import Completion from './completion';
import consoleReducer from '../reducers/console';

// TODO consider object-oriented
var prevValue = "";
var completion = null;
var completionOrigin = "";
let state = consoleReducer(undefined, {});

const blurMessage = () => {
  return {
    type: 'vimvixen.command.blur'
  };
};

const keydownMessage = (input) => {
  return {
    type: 'vimvixen.command.enter',
    value: input.value
  };
};

const keyupMessage = (input) => {
  return {
    type: 'vimvixen.command.change',
    value: input.value
  };
};

const handleBlur = () => {
  return browser.runtime.sendMessage(blurMessage());
};

const completeNext = () => {
  if (!completion) {
    return;
  }
  let item = completion.next();
  if (!item) {
    return;
  }

  let input = window.document.querySelector('#vimvixen-console-command-input');
  input.value = completionOrigin + ' ' + item[0].content;

  selectCompletion(item[1]);
}

const completePrev = () => {
  if (!completion) {
    return;
  }
  let item = completion.prev();
  if (!item) {
    return;
  }

  let input = window.document.querySelector('#vimvixen-console-command-input');
  input.value = completionOrigin + ' ' + item[0].content;

  selectCompletion(item[1]);
}

const handleKeydown = (e) => {
  switch(e.keyCode) {
  case KeyboardEvent.DOM_VK_ESCAPE:
    return browser.runtime.sendMessage(blurMessage());
  case KeyboardEvent.DOM_VK_RETURN:
    return browser.runtime.sendMessage(keydownMessage(e.target));
  case KeyboardEvent.DOM_VK_TAB:
    if (e.shiftKey) {
      completePrev();
    } else {
      completeNext();
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
  prevValue = e.target.value;
  return browser.runtime.sendMessage(keyupMessage(e.target));
};

window.addEventListener('load', () => {
  let input = window.document.querySelector('#vimvixen-console-command-input');
  input.addEventListener('blur', handleBlur);
  input.addEventListener('keydown', handleKeydown);
  input.addEventListener('keyup', handleKeyup);
});

const createCompletionTitle = (text) => {
  let li = document.createElement('li');
  li.className = 'vimvixen-console-completion-title';
  li.textContent = text;
  return li
}

const createCompletionItem = (icon, caption, url) => {
  let captionEle = document.createElement('span');
  captionEle.className = 'vimvixen-console-completion-item-caption';
  captionEle.textContent = caption

  let urlEle = document.createElement('span');
  urlEle.className = 'vimvixen-console-completion-item-url';
  urlEle.textContent = url

  let li = document.createElement('li');
  li.style.backgroundImage = 'url(' + icon + ')';
  li.className = 'vimvixen-console-completion-item';
  li.append(captionEle);
  li.append(urlEle);
  return li;
}

const selectCompletion = (target) => {
  let container  = window.document.querySelector('#vimvixen-console-completion');
  Array.prototype.forEach.call(container.children, (ele) => {
    if (!ele.classList.contains('vimvixen-console-completion-item')) {
      return;
    }
    if (ele === target) {
      ele.classList.add('vimvixen-completion-selected');
    } else {
      ele.classList.remove('vimvixen-completion-selected');
    }
  });
};

const updateCompletions = (completions) => {
  let completionsContainer  = window.document.querySelector('#vimvixen-console-completion');
  let input = window.document.querySelector('#vimvixen-console-command-input');

  completionsContainer.innerHTML = '';

  let pairs = [];

  for (let group of completions) {
    let title = createCompletionTitle(group.name);
    completionsContainer.append(title);

    for (let item of group.items) {
      let li = createCompletionItem(item.icon, item.caption, item.url);
      completionsContainer.append(li);

      pairs.push([item, li]);
    }
  }

  completion = new Completion(pairs);
  completionOrigin = input.value.split(' ')[0];
}

const update = (prevState, state) => {
  let error = window.document.querySelector('#vimvixen-console-error');
  let command = window.document.querySelector('#vimvixen-console-command');
  let input = window.document.querySelector('#vimvixen-console-command-input');

  error.style.display = state.errorShown ? 'block' : 'none';
  error.textContent = state.errorText;

  command.style.display = state.commandShown ? 'block' : 'none';
  if (!prevState.commandShown && state.commandShown) {
    // setup input on firstly shown
    input.value = state.commandText;
    input.focus();
  }

  if (JSON.stringify(state.completions) !== JSON.stringify(prevState.completions)) {
    updateCompletions(state.completions);
  }
}

browser.runtime.onMessage.addListener((action) => {
  let nextState = consoleReducer(state, action);
  if (JSON.stringify(nextState) !== JSON.stringify(state)) {
    update(state, nextState);
    state = nextState;
  }
});
