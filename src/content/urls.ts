import * as messages from '../shared/messages';
import * as urls from '../shared/urls';
import { Search } from '../shared/Settings';

const yank = (win: Window) => {
  let input = win.document.createElement('input');
  win.document.body.append(input);

  input.style.position = 'fixed';
  input.style.top = '-100px';
  input.value = win.location.href;
  input.select();

  win.document.execCommand('copy');

  input.remove();
};

const paste = (win: Window, newTab: boolean, search: Search) => {
  let textarea = win.document.createElement('textarea');
  win.document.body.append(textarea);

  textarea.style.position = 'fixed';
  textarea.style.top = '-100px';
  textarea.contentEditable = 'true';
  textarea.focus();

  if (win.document.execCommand('paste')) {
    let value = textarea.textContent as string;
    let url = urls.searchUrl(value, search);
    browser.runtime.sendMessage({
      type: messages.OPEN_URL,
      url,
      newTab,
    });
  }

  textarea.remove();
};

export { yank, paste };
