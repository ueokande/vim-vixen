import { METHOD_REQUEST, METHOD_RESPONSE } from '../shared/messages';

const generateId = () => {
  return Math.random().toString();
};

const send = (message) => {
  return new Promise((resolve) => {
    let id = generateId();
    let callback = (e) => {
      let packet = e.data;
      if (e.source !== window || packet.method !== METHOD_RESPONSE ||
        packet.id !== id) {
        return;
      }
      window.removeEventListener('message', callback);
      resolve(packet.message);
    };
    window.addEventListener('message', callback);

    window.postMessage({
      id,
      method: METHOD_REQUEST,
      message
    }, window.origin);
  });
};

export { send };
