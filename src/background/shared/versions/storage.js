const load = async() => {
  let { version } = await browser.storage.local.get('version');
  return version;
};

const save = (version) => {
  return browser.storage.local.set({ version });
};

export { load, save };
