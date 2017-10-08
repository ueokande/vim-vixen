import './site.scss';
import SettingComponent from 'settings/components/setting';
import settingReducer from 'settings/reducers/setting';
import { createStore } from 'store';

const store = createStore(settingReducer);
let settingComponent = null;

store.subscribe(() => {
  settingComponent.update();
});

document.addEventListener('DOMContentLoaded', () => {
  settingComponent = new SettingComponent(document.body, store);
});
