import * as actions from '../actions';

export interface State {
  setMode: boolean;
  jumpMode: boolean;
}

const defaultState: State = {
  setMode: false,
  jumpMode: false,
};

export default function reducer(
  state: State = defaultState,
  action: actions.MarkAction,
): State {
  switch (action.type) {
  case actions.MARK_START_SET:
    return { ...state, setMode: true };
  case actions.MARK_START_JUMP:
    return { ...state, jumpMode: true };
  case actions.MARK_CANCEL:
    return { ...state, setMode: false, jumpMode: false };
  default:
    return state;
  }
}
