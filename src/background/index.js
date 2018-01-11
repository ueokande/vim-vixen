import * as settingActions from 'background/actions/setting';
import messages from 'shared/messages';
import BackgroundComponent from 'background/components/background';
import reducers from 'background/reducers';
import { createStore } from 'shared/store';

const store = createStore(reducers, (e, sender) => {
  console.error('Vim-Vixen:', e);
  if (sender) {
    return browser.tabs.sendMessage(sender.tab.id, {
      type: messages.CONSOLE_SHOW_ERROR,
      text: e.message,
    });
  }
});
// eslint-disable-next-line no-unused-vars
const backgroundComponent = new BackgroundComponent(store);

store.dispatch(settingActions.load());
