import actions from '../actions';

const keyPress = (code, ctrl) => {
  return {
    type: actions.INPUT_KEY_PRESS,
    code,
    ctrl
  };
};

const clearKeys = () => {
  return {
    type: actions.INPUT_CLEAR_KEYS
  };
};

export { keyPress, clearKeys };
