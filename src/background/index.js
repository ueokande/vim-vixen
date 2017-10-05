import * as consoleActions from 'actions/console';
import * as settingsActions from 'actions/setting';
import BackgroundComponent from 'components/background';
import BackgroundInputComponent from 'components/background-input';
import reducers from 'reducers';
import messages from 'content/messages';
import { createStore } from 'store';

const store = createStore(reducers, (e, sender) => {
  console.error('Vim-Vixen:', e);
  if (sender) {
    store.dispatch(consoleActions.showError(e.message), sender);
  }
});
const backgroundComponent = new BackgroundComponent(store);
const backgroundInputComponent = new BackgroundInputComponent(store);
store.subscribe((sender) => {
  backgroundComponent.update(sender);
  backgroundInputComponent.update(sender);
});
store.subscribe((sender) => {
  if (sender) {
    return browser.tabs.sendMessage(sender.tab.id, {
      type: messages.STATE_UPDATE,
      state: store.getState()
    });
  }
});

store.dispatch(settingsActions.load());
