import * as actions from './index';

const enable = (
  newTab: boolean, background: boolean,
): actions.FollowAction => {
  return {
    type: actions.FOLLOW_CONTROLLER_ENABLE,
    newTab,
    background,
  };
};

const disable = (): actions.FollowAction => {
  return {
    type: actions.FOLLOW_CONTROLLER_DISABLE,
  };
};

const keyPress = (key: string): actions.FollowAction => {
  return {
    type: actions.FOLLOW_CONTROLLER_KEY_PRESS,
    key: key
  };
};

const backspace = (): actions.FollowAction => {
  return {
    type: actions.FOLLOW_CONTROLLER_BACKSPACE,
  };
};

export { enable, disable, keyPress, backspace };
