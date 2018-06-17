import * as settingActions from 'background/actions/setting';
import messages from 'shared/messages';
import BackgroundComponent from 'background/components/background';
import OperationComponent from 'background/components/operation';
import TabComponent from 'background/components/tab';
import IndicatorComponent from 'background/components/indicator';
import reducers from 'background/reducers';
import { createStore } from 'shared/store';
import * as versions from 'shared/versions';

const store = createStore(reducers, (e, sender) => {
  console.error('Vim-Vixen:', e);
  if (sender) {
    return browser.tabs.sendMessage(sender.tab.id, {
      type: messages.CONSOLE_SHOW_ERROR,
      text: e.message,
    });
  }
});

const checkAndNotifyUpdated = async() => {
  let updated = await versions.checkUpdated();
  if (!updated) {
    return;
  }
  await versions.notify();
  await versions.commit();
};

/* eslint-disable no-unused-vars */
const backgroundComponent = new BackgroundComponent(store);
const operationComponent = new OperationComponent(store);
const tabComponent = new TabComponent(store);
const indicatorComponent = new IndicatorComponent(store);
/* eslint-enable no-unused-vars */

store.dispatch(settingActions.load());

checkAndNotifyUpdated();
