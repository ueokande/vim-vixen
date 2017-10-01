import operations from '../../operations';

const VALID_TOP_KEYS = ['keymaps', 'search'];
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

const validate = (settings) => {
  validateInvalidTopKeys(settings);
  if (settings.keymaps) {
    validateKeymaps(settings.keymaps);
  }
};

export { validate };
