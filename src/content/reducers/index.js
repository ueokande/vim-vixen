import { combineReducers } from 'redux';
import addon from './addon';
import find from './find';
import setting from './setting';
import input from './input';
import console from './console';
import followController from './follow-controller';
import mark from './mark';

export default combineReducers({
  addon, find, setting, input, console, followController, mark,
});
