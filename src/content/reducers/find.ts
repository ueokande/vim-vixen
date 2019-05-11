import * as actions from '../actions';

export interface State {
  keyword: string | null;
  found: boolean;
}

const defaultState: State = {
  keyword: null,
  found: false,
};

export default function reducer(
  state: State = defaultState,
  action: actions.FindAction,
): State {
  switch (action.type) {
  case actions.FIND_SET_KEYWORD:
    return { ...state,
      keyword: action.keyword,
      found: action.found, };
  default:
    return state;
  }
}
