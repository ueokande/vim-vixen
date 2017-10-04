import './settings.scss';
import SettingComponent from '../components/setting';
import settingReducer from '../reducers/setting';
import { createStore } from '../store';

const store = createStore(settingReducer);
let settingComponent = null;

store.subscribe(() => {
  settingComponent.update();
});

document.addEventListener('DOMContentLoaded', () => {
  settingComponent = new SettingComponent(document.body, store);
});
