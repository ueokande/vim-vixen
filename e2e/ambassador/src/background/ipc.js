const receiveContentMessage = (func) => {
  browser.runtime.onMessage.addListener((message) => {
    return func(message);
  });
};

export { receiveContentMessage };
