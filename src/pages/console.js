import './console.scss';
import Completion from './completion';
import messages from '../content/messages';

// TODO consider object-oriented
let prevValue = '';
let completion = null;
let completionOrigin = '';
let prevState = {};

const handleBlur = () => {
  return browser.runtime.sendMessage({
    type: messages.CONSOLE_BLURRED,
  });
};

const selectCompletion = (target) => {
  let container = window.document.querySelector('#vimvixen-console-completion');
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
};

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

const createCompletionTitle = (text) => {
  let li = document.createElement('li');
  li.className = 'vimvixen-console-completion-title';
  li.textContent = text;
  return li;
};

const createCompletionItem = (icon, caption, url) => {
  let captionEle = document.createElement('span');
  captionEle.className = 'vimvixen-console-completion-item-caption';
  captionEle.textContent = caption;

  let urlEle = document.createElement('span');
  urlEle.className = 'vimvixen-console-completion-item-url';
  urlEle.textContent = url;

  let li = document.createElement('li');
  li.style.backgroundImage = 'url(' + icon + ')';
  li.className = 'vimvixen-console-completion-item';
  li.append(captionEle);
  li.append(urlEle);
  return li;
};

const updateCompletions = (completions) => {
  let completionsContainer =
    window.document.querySelector('#vimvixen-console-completion');
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
