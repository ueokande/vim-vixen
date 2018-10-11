import actions from 'content/actions';

const defaultState = {
  set: false,
  jump: false,
  marks: {},
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.MARK_START_SET:
    return { ...state, set: true };
  case actions.MARK_START_JUMP:
    return { ...state, jump: true };
  case actions.MARK_CANCEL:
    return { ...state, set: false, jump: false };
  case actions.MARK_SET_LOCAL: {
    let marks = { ...state.marks };
    marks[action.key] = { y: action.y };
    return { ...state, marks };
  }
  default:
    return state;
  }
}
