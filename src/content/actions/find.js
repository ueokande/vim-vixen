//
// window.find(aString, aCaseSensitive, aBackwards, aWrapAround,
//             aWholeWord, aSearchInFrames);
//
// NOTE: window.find is not standard API
// https://developer.mozilla.org/en-US/docs/Web/API/Window/find

import messages from 'shared/messages';
import actions from 'content/actions';
import * as consoleFrames from '../console-frames';

const postPatternNotFound = (pattern) => {
  return consoleFrames.postError(
    window.document,
    'Pattern not found: ' + pattern);
};

const postPatternFound = (pattern) => {
  return consoleFrames.postInfo(
    window.document,
    'Pattern found: ' + pattern,
  );
};

const postNoPrevious = () => {
  return consoleFrames.postError(
    window.document,
    'No previous search keywords');
};

const find = (string, backwards) => {
  let caseSensitive = false;
  let wrapScan = true;


  // NOTE: aWholeWord dows not implemented, and aSearchInFrames does not work
  // because of same origin policy
  let found = window.find(string, caseSensitive, backwards, wrapScan);
  if (found) {
    return found;
  }
  window.getSelection().removeAllRanges();
  return window.find(string, caseSensitive, backwards, wrapScan);
};

const findNext = async(currentKeyword, reset, backwards) => {
  if (reset) {
    window.getSelection().removeAllRanges();
  }

  let keyword = currentKeyword;
  if (currentKeyword) {
    browser.runtime.sendMessage({
      type: messages.FIND_SET_KEYWORD,
      keyword: currentKeyword,
    });
  } else {
    keyword = await browser.runtime.sendMessage({
      type: messages.FIND_GET_KEYWORD,
    });
  }
  if (!keyword) {
    return postNoPrevious();
  }
  let found = find(keyword, backwards);
  if (found) {
    postPatternFound(keyword);
  } else {
    postPatternNotFound(keyword);
  }

  return {
    type: actions.FIND_SET_KEYWORD,
    keyword,
    found,
  };
};

const next = (currentKeyword, reset) => {
  return findNext(currentKeyword, reset, false);
};

const prev = (currentKeyword, reset) => {
  return findNext(currentKeyword, reset, true);
};

export { next, prev };
