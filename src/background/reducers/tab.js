import actions from 'background/actions';

const defaultState = {
  previousSelected: -1,
  currentSelected: -1,
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.TAB_SELECTED:
    return {
      previousSelected: state.currentSelected,
      currentSelected: action.tabId,
    };
  default:
    return state;
  }
}

