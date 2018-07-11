import { combineReducers } from 'redux';
import addon from './addon';
import find from './find';
import setting from './setting';
import input from './input';
import followController from './follow-controller';

export default combineReducers({
  addon, find, setting, input, followController,
});
