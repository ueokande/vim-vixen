import * as settingActions from 'background/actions/setting';
import BackgroundComponent from 'background/components/background';
import OperationComponent from 'background/components/operation';
import TabComponent from 'background/components/tab';
import IndicatorComponent from 'background/components/indicator';
import reducers from 'background/reducers';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import * as versions from 'shared/versions';

const store = createStore(
  reducers,
  applyMiddleware(promise),
);

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
