import actions from 'content/actions';

const enable = () => {
  return { type: actions.ADDON_ENABLE };
};

const disable = () => {
  return { type: actions.ADDON_DISABLE };
};

const toggleEnabled = () => {
  return { type: actions.ADDON_TOGGLE_ENABLED };
};

export { enable, disable, toggleEnabled };
