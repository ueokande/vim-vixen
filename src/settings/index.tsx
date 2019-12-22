import React from 'react';
import ReactDOM from 'react-dom';
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
  const wrapper = document.getElementById('vimvixen-settings');
  ReactDOM.render(
    <Provider store={store}>
      <SettingsComponent store={store} />
    </Provider>,
    wrapper
  );
});
