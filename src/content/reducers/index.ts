import { combineReducers } from 'redux';
import addon, { State as AddonState } from './addon';
import find, { State as FindState } from './find';
import setting, { State as SettingState } from './setting';
import input, { State as InputState } from './input';
import followController, { State as FollowControllerState }
  from './follow-controller';
import mark, { State as MarkState } from './mark';

export interface State {
  addon: AddonState;
  find: FindState;
  setting: SettingState;
  input: InputState;
  followController: FollowControllerState;
  mark: MarkState;
}

export default combineReducers({
  addon, find, setting, input, followController, mark,
});
