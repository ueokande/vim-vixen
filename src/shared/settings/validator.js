import operations from 'shared/operations';
import * as properties from './properties';

const VALID_TOP_KEYS = ['keymaps', 'search', 'blacklist', 'properties'];
const VALID_OPERATION_VALUES = Object.keys(operations).map((key) => {
  return operations[key];
});

const validateInvalidTopKeys = (settings) => {
  let invalidKey = Object.keys(settings).find((key) => {
    return !VALID_TOP_KEYS.includes(key);
  });
  if (invalidKey) {
    throw Error(`Unknown key: "${invalidKey}"`);
  }
};

const validateKeymaps = (keymaps) => {
  for (let key of Object.keys(keymaps)) {
    let value = keymaps[key];
    if (!VALID_OPERATION_VALUES.includes(value.type)) {
      throw Error(`Unknown operation: "${value.type}"`);
    }
  }
};

const validateSearch = (search) => {
  let engines = search.engines;
  for (let key of Object.keys(engines)) {
    if (/\s/.test(key)) {
      throw new Error(
        `While space in search engine name is not allowed: "${key}"`
      );
    }
    let url = engines[key];
    if (!url.match(/{}/)) {
      throw new Error(`No {}-placeholders in URL of "${key}"`);
    }
    if (url.match(/{}/g).length > 1) {
      throw new Error(`Multiple {}-placeholders in URL of "${key}"`);
    }
  }

  if (!search.default) {
    throw new Error(`Default engine is not set`);
  }
  if (!Object.keys(engines).includes(search.default)) {
    throw new Error(`Default engine "${search.default}" not found`);
  }
};

const validateProperties = (props) => {
  for (let name of Object.keys(props)) {
    if (!properties.types[name]) {
      throw new Error(`Unknown property name: "${name}"`);
    }
    if (typeof props[name] !== properties.types[name]) {
      throw new Error(`Invalid type for property: "${name}"`);
    }
  }
};

const validate = (settings) => {
  validateInvalidTopKeys(settings);
  if (settings.keymaps) {
    validateKeymaps(settings.keymaps);
  }
  if (settings.search) {
    validateSearch(settings.search);
  }
  if (settings.properties) {
    validateProperties(settings.properties);
  }
};

export { validate };
