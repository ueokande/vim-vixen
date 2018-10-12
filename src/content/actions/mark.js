import actions from 'content/actions';
import messages from 'shared/messages';

const startSet = () => {
  return { type: actions.MARK_START_SET };
};

const startJump = () => {
  return { type: actions.MARK_START_JUMP };
};

const cancel = () => {
  return { type: actions.MARK_CANCEL };
};

const setLocal = (key, x, y) => {
  return {
    type: actions.MARK_SET_LOCAL,
    key,
    x,
    y,
  };
};

const setGlobal = (key, x, y) => {
  browser.runtime.sendMessage({
    type: messages.MARK_SET_GLOBAL,
    key,
    x,
    y,
  });
  return { type: '' };
};

const jumpGlobal = (key) => {
  browser.runtime.sendMessage({
    type: messages.MARK_JUMP_GLOBAL,
    key,
  });
  return { type: '' };
};

export {
  startSet, startJump, cancel, setLocal,
  setGlobal, jumpGlobal,
};
