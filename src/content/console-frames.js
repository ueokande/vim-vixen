import './console-frame.scss';
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

const postMessage = (doc, message) => {
  let iframe = doc.getElementById('vimvixen-console-frame');
  iframe.contentWindow.postMessage(JSON.stringify(message), '*');
};

const postError = (doc, message) => {
  return postMessage(doc, {
    type: messages.CONSOLE_SHOW_ERROR,
    text: message,
  });
};

export { initialize, blur, postMessage, postError };
