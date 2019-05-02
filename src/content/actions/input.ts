import * as actions from './index';

const keyPress = (key: string): actions.InputAction => {
  return {
    type: actions.INPUT_KEY_PRESS,
    key,
  };
};

const clearKeys = (): actions.InputAction => {
  return {
    type: actions.INPUT_CLEAR_KEYS
  };
};

export { keyPress, clearKeys };
