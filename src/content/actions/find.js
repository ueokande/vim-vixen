//
// window.find(aString, aCaseSensitive, aBackwards, aWrapAround,
//             aWholeWord, aSearchInFrames);
//
// NOTE: window.find is not standard API
// https://developer.mozilla.org/en-US/docs/Web/API/Window/find

import actions from 'content/actions';
import * as consoleFrames from '../console-frames';

const postPatternNotFound = (pattern) => {
  return consoleFrames.postError(
    window.document,
    'Pattern not found: ' + pattern);
};

const find = (string, backwards) => {
  let caseSensitive = false;
  let wrapScan = true;


  // NOTE: aWholeWord dows not implemented, and aSearchInFrames does not work
  // because of same origin policy
  return window.find(string, caseSensitive, backwards, wrapScan);
};

const findNext = (keyword, reset, backwards) => {
  if (reset) {
    window.getSelection().removeAllRanges();
  }

  let found = find(keyword, backwards);
  if (!found) {
    window.getSelection().removeAllRanges();
    found = find(keyword, backwards);
  }
  if (!found) {
    postPatternNotFound(keyword);
  }
  return {
    type: actions.FIND_SET_KEYWORD,
    keyword,
    found,
  };
};

const next = (keyword, reset) => {
  return findNext(keyword, reset, false);
};

const prev = (keyword, reset) => {
  return findNext(keyword, reset, true);
};

export { next, prev };
