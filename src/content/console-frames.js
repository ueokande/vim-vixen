import messages from 'shared/messages';

const initialize = (doc) => {
  let iframe = doc.createElement('iframe');
  iframe.src = browser.runtime.getURL('build/console.html');
  iframe.id = 'vimvixen-console-frame';
  iframe.className = 'vimvixen-console-frame';
  doc.body.append(iframe);

  return iframe;
};

const blur = (doc) => {
  let iframe = doc.getElementById('vimvixen-console-frame');
  iframe.blur();
};

const postError = (text) => {
  browser.runtime.sendMessage({
    type: messages.CONSOLE_FRAME_MESSAGE,
    message: {
      type: messages.CONSOLE_SHOW_ERROR,
      text,
    },
  });
};

const postInfo = (text) => {
  browser.runtime.sendMessage({
    type: messages.CONSOLE_FRAME_MESSAGE,
    message: {
      type: messages.CONSOLE_SHOW_INFO,
      text,
    },
  });
};

export { initialize, blur, postError, postInfo };
