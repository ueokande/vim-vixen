import * as messages from '../shared/messages';

const initialize = (doc: Document): HTMLIFrameElement => {
  let iframe = doc.createElement('iframe');
  iframe.src = browser.runtime.getURL('build/console.html');
  iframe.id = 'vimvixen-console-frame';
  iframe.className = 'vimvixen-console-frame';
  doc.body.append(iframe);

  return iframe;
};

const blur = (doc: Document) => {
  let ele = doc.getElementById('vimvixen-console-frame') as HTMLIFrameElement;
  ele.blur();
};

const postError = (text: string): Promise<any> => {
  return browser.runtime.sendMessage({
    type: messages.CONSOLE_FRAME_MESSAGE,
    message: {
      type: messages.CONSOLE_SHOW_ERROR,
      text,
    },
  });
};

const postInfo = (text: string): Promise<any> => {
  return browser.runtime.sendMessage({
    type: messages.CONSOLE_FRAME_MESSAGE,
    message: {
      type: messages.CONSOLE_SHOW_INFO,
      text,
    },
  });
};

export { initialize, blur, postError, postInfo };
