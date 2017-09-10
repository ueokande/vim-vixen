import actions from '../actions';

export function keyPress(code, ctrl) {
  return {
    type: actions.INPUT_KEY_PRESS,
    code,
    ctrl
  };
}

export function clearKeys() {
  return {
    type: actions.INPUT_CLEAR_KEYS
  }
}
