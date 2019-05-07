import * as actions from './index';
import * as messages from '../../shared/messages';

const startSet = (): actions.MarkAction => {
  return { type: actions.MARK_START_SET };
};

const startJump = (): actions.MarkAction => {
  return { type: actions.MARK_START_JUMP };
};

const cancel = (): actions.MarkAction => {
  return { type: actions.MARK_CANCEL };
};

const setLocal = (key: string, x: number, y: number): actions.MarkAction => {
  return {
    type: actions.MARK_SET_LOCAL,
    key,
    x,
    y,
  };
};

const setGlobal = (key: string, x: number, y: number): actions.MarkAction => {
  browser.runtime.sendMessage({
    type: messages.MARK_SET_GLOBAL,
    key,
    x,
    y,
  });
  return { type: actions.NOOP };
};

const jumpGlobal = (key: string): actions.MarkAction => {
  browser.runtime.sendMessage({
    type: messages.MARK_JUMP_GLOBAL,
    key,
  });
  return { type: actions.NOOP };
};

export {
  startSet, startJump, cancel, setLocal,
  setGlobal, jumpGlobal,
};
