import './settings.scss';
import SettingComponent from '../components/setting';
import settingReducer from '../reducers/setting';
import * as store from '../store';

const settingStore = store.createStore(settingReducer);
let settingComponent = null;

settingStore.subscribe(() => {
  settingComponent.update();
});

document.addEventListener('DOMContentLoaded', () => {
  settingComponent = new SettingComponent(document.body, settingStore);
});
