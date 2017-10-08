import * as settingsActions from 'settings/actions/setting';
import messages from 'shared/messages';
import BackgroundComponent from 'background/components/background';
import reducers from 'settings/reducers/setting';
import { createStore } from 'store';

const store = createStore(reducers, (e, sender) => {
  console.error('Vim-Vixen:', e);
  if (sender) {
    return browser.tabs.sendMessage(sender.tab.id, {
      type: messages.CONSOLE_SHOW_ERROR,
      text: e.message,
    });
  }
});
const backgroundComponent = new BackgroundComponent(store);
store.subscribe((sender) => {
  backgroundComponent.update(sender);
});

store.dispatch(settingsActions.load());
