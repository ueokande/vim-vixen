import * as messages from '../../shared/messages';
import * as actions from './index';

const enable = (): Promise<actions.AddonAction> => setEnabled(true);

const disable = (): Promise<actions.AddonAction> => setEnabled(false);

const setEnabled = async(enabled: boolean): Promise<actions.AddonAction> => {
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
