import * as actions from './index';
import Key from '../domains/Key';

const keyPress = (key: Key): actions.InputAction => {
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
