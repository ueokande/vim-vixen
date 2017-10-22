import actions from 'content/actions';

const keyPress = (key) => {
  return {
    type: actions.INPUT_KEY_PRESS,
    key,
  };
};

const clearKeys = () => {
  return {
    type: actions.INPUT_CLEAR_KEYS
  };
};

export { keyPress, clearKeys };
