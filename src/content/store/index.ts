import promise from 'redux-promise';
import reducers from '../reducers';
import { createStore, applyMiddleware } from 'redux';

export const newStore = () => createStore(
  reducers,
  applyMiddleware(promise),
);
