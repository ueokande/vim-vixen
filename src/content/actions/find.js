//
// window.find(aString, aCaseSensitive, aBackwards, aWrapAround,
//             aWholeWord, aSearchInFrames);
//
// NOTE: window.find is not standard API
// https://developer.mozilla.org/en-US/docs/Web/API/Window/find

import actions from 'content/actions';

const show = () => {
  return { type: actions.FIND_SHOW };
};

const hide = () => {
  return { type: actions.FIND_HIDE };
};

const next = (keyword) => {
  // TODO Error on no matched
  window.find(keyword, false, false, true, false, true);
  return {
    type: actions.FIND_SET_KEYWORD,
    keyword,
  };
};

const prev = (keyword) => {
  // TODO Error on no matched
  window.find(keyword, false, true, true, false, true);
  return {
    type: actions.FIND_SET_KEYWORD,
    keyword,
  };
};

export { show, hide, next, prev };
