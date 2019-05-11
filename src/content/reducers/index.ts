import { combineReducers } from 'redux';
import input, { State as InputState } from './input';
import followController, { State as FollowControllerState }
  from './follow-controller';
import mark, { State as MarkState } from './mark';

export interface State {
  input: InputState;
  followController: FollowControllerState;
  mark: MarkState;
}

export default combineReducers({
  input, followController, mark,
});
