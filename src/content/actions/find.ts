//
// window.find(aString, aCaseSensitive, aBackwards, aWrapAround,
//             aWholeWord, aSearchInFrames);
//
// NOTE: window.find is not standard API
// https://developer.mozilla.org/en-US/docs/Web/API/Window/find

import * as messages from '../../shared/messages';
import * as actions from './index';
import * as consoleFrames from '../console-frames';

const find = (str: string, backwards: boolean): boolean => {
  let caseSensitive = false;
  let wrapScan = true;


  // NOTE: aWholeWord dows not implemented, and aSearchInFrames does not work
  // because of same origin policy

  // eslint-disable-next-line no-extra-parens
  let found = (<any>window).find(str, caseSensitive, backwards, wrapScan);
  if (found) {
    return found;
  }
  let sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
  }

  // eslint-disable-next-line no-extra-parens
  return (<any>window).find(str, caseSensitive, backwards, wrapScan);
};

// eslint-disable-next-line max-statements
const findNext = async(
  currentKeyword: string, reset: boolean, backwards: boolean,
): Promise<actions.FindAction> => {
  if (reset) {
    let sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
    }
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
    await consoleFrames.postError('No previous search keywords');
    return { type: actions.NOOP };
  }
  let found = find(keyword, backwards);
  if (found) {
    consoleFrames.postInfo('Pattern found: ' + keyword);
  } else {
    consoleFrames.postError('Pattern not found: ' + keyword);
  }

  return {
    type: actions.FIND_SET_KEYWORD,
    keyword,
    found,
  };
};

const next = (
  currentKeyword: string, reset: boolean,
): Promise<actions.FindAction> => {
  return findNext(currentKeyword, reset, false);
};

const prev = (
  currentKeyword: string, reset: boolean,
): Promise<actions.FindAction> => {
  return findNext(currentKeyword, reset, true);
};

export { next, prev };
