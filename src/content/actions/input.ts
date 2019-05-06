import * as actions from './index';
import * as keyUtils from '../../shared/utils/keys';

const keyPress = (key: keyUtils.Key): actions.InputAction => {
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
