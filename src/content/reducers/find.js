import actions from 'content/actions';

const defaultState = {
  enabled: false,
  keyword: '',
  found: false,
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.FIND_SHOW:
    return Object.assign({}, state, {
      enabled: true,
    });
  case actions.FIND_HIDE:
    return Object.assign({}, state, {
      enabled: false,
    });
  case actions.FIND_SET_KEYWORD:
    return Object.assign({}, state, {
      keyword: action.keyword,
      found: action.found,
    });
  default:
    return state;
  }
}
