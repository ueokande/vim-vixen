import { h, render } from 'preact';
import SettingsComponent from './components';
import reducer from 'settings/reducers/setting';
import Provider from 'shared/store/provider';
import { createStore } from 'shared/store';

const store = createStore(reducer);

document.addEventListener('DOMContentLoaded', () => {
  let wrapper = document.getElementById('vimvixen-settings');
  render(
    <Provider store={store}>
      <SettingsComponent />
    </Provider>,
    wrapper
  );
});
