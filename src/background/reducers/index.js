import { combineReducers } from 'redux';
import setting from './setting';
import find from './find';
import tab from './tab';

export default combineReducers({
  setting, find, tab,
});
