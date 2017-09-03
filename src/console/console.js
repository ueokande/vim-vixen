import './console.scss';
import * as messages from '../shared/messages';

const parent = window.parent;

// TODO consider object-oriented
var prevValue = "";

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

const handleKeydown = (e) => {
  switch(e.keyCode) {
  case KeyboardEvent.DOM_VK_ESCAPE:
    messages.send(parent, blurMessage());
    break;
  case KeyboardEvent.DOM_VK_RETURN:
    messages.send(parent, keydownMessage(e.target));
    break;
  }
};

const handleKeyup = (e) => {
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
}

const showError = (text) => {
  let error = window.document.querySelector('#vimvixen-console-error');
  error.textContent = text;
  error.style.display = 'block';

  let command = window.document.querySelector('#vimvixen-console-command');
  command.style.display = 'none';
}

messages.receive(window, (message) => {
  switch (message.type) {
  case 'vimvixen.console.show.command':
    showCommand(message.text);
    break;
  case 'vimvixen.console.show.error':
    showError(message.text);
    break;
  }
});
