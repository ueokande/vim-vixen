import { combineReducers } from 'redux';
import find, { State as FindState } from './find';
import input, { State as InputState } from './input';
import followController, { State as FollowControllerState }
  from './follow-controller';
import mark, { State as MarkState } from './mark';

export interface State {
  find: FindState;
  input: InputState;
  followController: FollowControllerState;
  mark: MarkState;
}

export default combineReducers({
  find, input, followController, mark,
});
