import * as actions from '../actions';

interface Mark {
  x: number;
  y: number;
}

export interface State {
  setMode: boolean;
  jumpMode: boolean;
  marks: { [key: string]: Mark };
}

const defaultState: State = {
  setMode: false,
  jumpMode: false,
  marks: {},
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
  case actions.MARK_SET_LOCAL: {
    let marks = { ...state.marks };
    marks[action.key] = { x: action.x, y: action.y };
    return { ...state, setMode: false, marks };
  }
  default:
    return state;
  }
}
