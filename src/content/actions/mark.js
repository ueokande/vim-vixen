import actions from 'content/actions';

const startSet = () => {
  return { type: actions.MARK_START_SET };
};

const startJump = () => {
  return { type: actions.MARK_START_JUMP };
};

const cancel = () => {
  return { type: actions.MARK_CANCEL };
};

const setLocal = (key, y) => {
  return {
    type: actions.MARK_SET_LOCAL,
    key,
    y,
  };
};

export {
  startSet, startJump, cancel, setLocal,
};
