import { METHOD_REQUEST, METHOD_RESPONSE } from '../shared/messages';

const sendToBackground = (message) => {
  return browser.runtime.sendMessage(message);
};

const receiveBackgroundMesssage = (func) => {
  return browser.runtime.onMessage.addListener((message) => {
    return Promise.resolve(func(message));
  });
};

const receivePageMessage = (func) => {
  window.addEventListener('message', (e) => {
    let packet = e.data;
    if (e.origin !== window.origin || packet.method !== METHOD_REQUEST) {
      return;
    }

    let resp = {
      id: packet.id,
      method: METHOD_RESPONSE,
    };
    let respMessage = func(packet.message);
    if (respMessage instanceof Promise) {
      return respMessage.then((data) => {
        resp.message = data;
        e.source.postMessage(resp, e.origin);
      });
    } else if (respMessage) {
      resp.message = respMessage;
    }
    e.source.postMessage(resp, e.origin);
  });
};

export {
  sendToBackground, receiveBackgroundMesssage,
  receivePageMessage,
};
