import './console.scss';
import Completion from './completion';
import * as messages from '../shared/messages';

const parent = window.parent;

// TODO consider object-oriented
var prevValue = "";
var completion = null;
var completionOrigin = "";

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
  messages.send(parent, blurMessage());
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
    messages.send(parent, blurMessage());
    break;
  case KeyboardEvent.DOM_VK_RETURN:
    messages.send(parent, keydownMessage(e.target));
    break;
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
  messages.send(parent, keyupMessage(e.target));
  prevValue = e.target.value;
};

window.addEventListener('load', () => {
  let input = window.document.querySelector('#vimvixen-console-command-input');
  input.addEventListener('blur', handleBlur);
  input.addEventListener('keydown', handleKeydown);
  input.addEventListener('keyup', handleKeyup);
});

const showCommand = (text) => {
  let command = window.document.querySelector('#vimvixen-console-command');
  command.style.display = 'block';

  let error = window.document.querySelector('#vimvixen-console-error');
  error.style.display = 'none';

  let input = window.document.querySelector('#vimvixen-console-command-input');
  input.value = text;
  input.focus();

  completion = null;
  let container  = window.document.querySelector('#vimvixen-console-completion');
  container.innerHTML = '';
  messages.send(parent, keyupMessage(input));
}

const showError = (text) => {
  let error = window.document.querySelector('#vimvixen-console-error');
  error.textContent = text;
  error.style.display = 'block';

  let command = window.document.querySelector('#vimvixen-console-command');
  command.style.display = 'none';

  let completion  = window.document.querySelector('#vimvixen-console-completion');
  completion.style.display = 'none';
}

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

const setCompletions = (completions) => {
  let container  = window.document.querySelector('#vimvixen-console-completion');
  container.style.display = 'block';
  container.innerHTML = '';

  let pairs = [];

  for (let group of completions) {
    let title = createCompletionTitle(group.name);
    container.append(title);

    for (let item of group.items) {
      let li = createCompletionItem(item.icon, item.caption, item.url);
      container.append(li);

      pairs.push([item, li]);
    }
  }

  completion = new Completion(pairs);

  let input = window.document.querySelector('#vimvixen-console-command-input');
  completionOrigin = input.value.split(' ')[0];
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

messages.receive(window, (message) => {
  switch (message.type) {
  case 'vimvixen.console.show.error':
    showError(message.text);
    break;
  case 'vimvixen.console.set.completions':
    setCompletions(message.completions);
    break;
  }
});

browser.runtime.onMessage.addListener((action) => {
  switch (action.type) {
  case 'vimvixen.console.show.command':
    return showCommand(action.text);
  }
  return Promise.resolve();
});
