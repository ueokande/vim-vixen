import './console.scss';
import * as messages from '../shared/messages';

const parent = window.parent;

// TODO consider object-oriented
var prevValue = "";

const blurMessage = () => {
  return {
    type: 'vimvixen.commandline.blur'
  };
};

const keydownMessage = (input) => {
  return {
    type: 'vimvixen.commandline.enter',
    value: input.value
  };
};

const keyupMessage = (input) => {
  return {
    type: 'vimvixen.commandline.change',
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
  let hash = window.location.hash;
  let initial = '';
  if (hash.length > 0) {
    initial = decodeURIComponent(hash.substring(1));
  }

  let input = window.document.querySelector('#vimvixen-console-command-input');
  input.addEventListener('blur', handleBlur);
  input.addEventListener('keydown', handleKeydown);
  input.addEventListener('keyup', handleKeyup);
  input.value = initial;
  input.focus();
});
