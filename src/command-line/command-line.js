import './command-line.scss';

const parent = window.parent;

// TODO consider object-oriented
var prevValue = "";

const blurData = () => {
  return JSON.stringify({
    type: 'vimvixen.commandline.blur'
  });
};

const keydownData = (input) => {
  return JSON.stringify({
    type: 'vimvixen.commandline.enter',
    value: input.value
  });
};

const keyupData = (input) => {
  return JSON.stringify({
    type: 'vimvixen.commandline.change',
    value: input.value
  });
};

const handleBlur = () => {
  parent.postMessage(blurData(), '*');
};

const handleKeydown = (e) => {
  switch(e.keyCode) {
  case KeyboardEvent.DOM_VK_ESCAPE:
    parent.postMessage(blurData(), '*');
    break;
  case KeyboardEvent.DOM_VK_RETURN:
    parent.postMessage(keydownData(e.target), '*');
    break;
  }
};

const handleKeyup = (e) => {
  if (e.target.value === prevValue) {
    return;
  }
  parent.postMessage(keyupData(e.target), '*');
  prevValue = e.target.value;
};

window.addEventListener('load', () => {
  let hash = window.location.hash;
  let initial = '';
  if (hash.length > 0) {
    initial = decodeURIComponent(hash.substring(1));
  }

  let input = window.document.querySelector('#vimvixen-command-line-line-input');
  input.addEventListener('blur', handleBlur);
  input.addEventListener('keydown', handleKeydown);
  input.addEventListener('keyup', handleKeyup);
  input.value = initial;
  input.focus();
});
