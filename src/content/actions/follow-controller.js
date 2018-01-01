import actions from 'content/actions';

const enable = (operation, newTab, format) => {
  return {
    type: actions.FOLLOW_CONTROLLER_ENABLE,
    operation,
    newTab,
    format,
  };
};

const disable = () => {
  return {
    type: actions.FOLLOW_CONTROLLER_DISABLE,
  };
};

const keyPress = (key) => {
  return {
    type: actions.FOLLOW_CONTROLLER_KEY_PRESS,
    key: key
  };
};

const backspace = () => {
  return {
    type: actions.FOLLOW_CONTROLLER_BACKSPACE,
  };
};

export { enable, disable, keyPress, backspace };
