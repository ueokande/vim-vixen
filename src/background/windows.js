const openWindow = () => {
  return browser.windows.create({});
};

const openWindowIncognito = () => {
  return browser.windows.create({ 'incognito': true });
};

export { openWindow, openWindowIncognito };
