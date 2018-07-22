import BackgroundComponent from 'background/components/background';
import OperationComponent from 'background/components/operation';
import TabComponent from 'background/components/tab';
import reducers from 'background/reducers';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';

import ContentMessageListener from './infrastructures/content-message-listener';
import SettingController from './controllers/setting';
import VersionRepository from './controllers/version';

const store = createStore(
  reducers,
  applyMiddleware(promise),
);

/* eslint-disable no-unused-vars */
const backgroundComponent = new BackgroundComponent(store);
const operationComponent = new OperationComponent(store);
const tabComponent = new TabComponent(store);
/* eslint-enable no-unused-vars */

new SettingController().reload();
new VersionRepository().notifyIfUpdated();

new ContentMessageListener().run();
