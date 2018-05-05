const load = () => {
  return browser.storage.local.get('version').then(({ version }) => {
    return version;
  });
};

const save = (version) => {
  return browser.storage.local.set({ version });
};

export { load, save };
