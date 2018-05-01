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

const find = (string, backwards) => {
  let caseSensitive = false;
  let wrapScan = true;


  // NOTE: aWholeWord dows not implemented, and aSearchInFrames does not work
  // because of same origin policy
  return window.find(string, caseSensitive, backwards, wrapScan);
};

const findNext = (currentKeyword, reset, backwards) => {
  if (reset) {
    window.getSelection().removeAllRanges();
  }

  let promise = Promise.resolve(currentKeyword);
  if (currentKeyword) {
    browser.runtime.sendMessage({
      type: messages.FIND_SET_KEYWORD,
      keyword: currentKeyword,
    });
  } else {
    promise = browser.runtime.sendMessage({
      type: messages.FIND_GET_KEYWORD,
    });
  }

  return promise.then((keyword) => {
    let found = find(keyword, backwards);
    if (!found) {
      window.getSelection().removeAllRanges();
      found = find(keyword, backwards);
    }
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
  });
};

const next = (currentKeyword, reset) => {
  return findNext(currentKeyword, reset, false);
};

const prev = (currentKeyword, reset) => {
  return findNext(currentKeyword, reset, true);
};

export { next, prev };
