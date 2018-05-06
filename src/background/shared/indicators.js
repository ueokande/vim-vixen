const enable = () => {
  return browser.browserAction.setIcon({
    path: 'resources/enabled_32x32.png',
  });
};

const disable = () => {
  return browser.browserAction.setIcon({
    path: 'resources/disabled_32x32.png',
  });
};

export { enable, disable };
