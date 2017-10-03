import actions from '../actions';

const asKeymapChars = (key, ctrl) => {
  if (ctrl) {
    return '<C-' + key.toUpperCase() + '>';
  }
  return key;
};

const keyPress = (key, ctrl) => {
  return {
    type: actions.INPUT_KEY_PRESS,
    key: asKeymapChars(key, ctrl),
  };
};

const clearKeys = () => {
  return {
    type: actions.INPUT_CLEAR_KEYS
  };
};

export { keyPress, clearKeys };
