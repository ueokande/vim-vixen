import * as actions from './index';

const startSet = (): actions.MarkAction => {
  return { type: actions.MARK_START_SET };
};

const startJump = (): actions.MarkAction => {
  return { type: actions.MARK_START_JUMP };
};

const cancel = (): actions.MarkAction => {
  return { type: actions.MARK_CANCEL };
};

export {
  startSet, startJump, cancel,
};
