import * as consoleActions from '../actions/console';
import * as settingsActions from '../actions/setting';
import BackgroundComponent from '../components/background';
import BackgroundInputComponent from '../components/background-input';
import reducers from '../reducers';
import messages from '../content/messages';
import * as store from '../store';

const backgroundStore = store.createStore(reducers, (e, sender) => {
  console.error('Vim-Vixen:', e);
  if (sender) {
    backgroundStore.dispatch(consoleActions.showError(e.message), sender);
  }
});
const backgroundComponent = new BackgroundComponent(backgroundStore);
const backgroundInputComponent = new BackgroundInputComponent(backgroundStore);
backgroundStore.subscribe((sender) => {
  backgroundComponent.update(sender);
  backgroundInputComponent.update(sender);
});
backgroundStore.subscribe((sender) => {
  if (sender) {
    return browser.tabs.sendMessage(sender.tab.id, {
      type: messages.STATE_UPDATE,
      state: backgroundStore.getState()
    });
  }
});

backgroundStore.dispatch(settingsActions.load());
