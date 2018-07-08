import { h, render } from 'preact';
import SettingsComponent from './components';
import reducer from './reducers/setting';
import { Provider } from 'preact-redux';
import promise from 'redux-promise';
import { createStore, applyMiddleware } from 'redux';

const store = createStore(
  reducer,
  applyMiddleware(promise),
);

document.addEventListener('DOMContentLoaded', () => {
  let wrapper = document.getElementById('vimvixen-settings');
  render(
    <Provider store={store}>
      <SettingsComponent />
    </Provider>,
    wrapper
  );
});
