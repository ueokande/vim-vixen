import messages from 'shared/messages';
import actions from 'content/actions';

const enable = () => setEnabled(true);

const disable = () => setEnabled(false);

const setEnabled = async(enabled) => {
  await browser.runtime.sendMessage({
    type: messages.ADDON_ENABLED_RESPONSE,
    enabled,
  });
  return {
    type: actions.ADDON_SET_ENABLED,
    enabled,
  };
};

export { enable, disable, setEnabled };
