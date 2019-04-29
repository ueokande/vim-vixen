import { render } from 'react';
import SettingsComponent from './components';
import reducer from './reducers/setting';
import { Provider } from 'react-redux';
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
