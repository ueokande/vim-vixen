import actions from 'content/actions';

const defaultState = {
  keyword: '',
  found: false,
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.FIND_SET_KEYWORD:
    return Object.assign({}, state, {
      keyword: action.keyword,
      found: action.found,
    });
  default:
    return state;
  }
}
