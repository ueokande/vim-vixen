const operationFromName = (name) => {
  let [type, argStr] = name.split('?');
  let args = {};
  if (argStr) {
    args = JSON.parse(argStr);
  }
  return Object.assign({ type }, args);
};

const fromJson = (json) => {
  return JSON.parse(json);
};

const fromForm = (form) => {
  let keymaps = {};
  for (let name of Object.keys(form.keymaps)) {
    let keys = form.keymaps[name];
    keymaps[keys] = operationFromName(name);
  }

  let engines = {};
  for (let { name, url } of form.search.engines) {
    engines[name] = url;
  }
  let search = {
    default: form.search.default,
    engines,
  };

  let blacklist = form.blacklist;

  return { keymaps, search, blacklist };
};

export { fromJson, fromForm };
