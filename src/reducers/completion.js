import actions from '../actions';

const defaultState = {
  groupSelection: -1,
  itemSelection: -1,
  groups: [],
};

const nextSelection = (state) => {
  if (state.groupSelection < 0) {
    return [0, 0];
  }

  let group = state.groups[state.groupSelection];
  if (state.groupSelection + 1 >= state.groups.length &&
    state.itemSelection + 1 >= group.items.length) {
    return [-1, -1];
  }
  if (state.itemSelection + 1 >= group.items.length) {
    return [state.groupSelection + 1, 0];
  }
  return [state.groupSelection, state.itemSelection + 1];
};

const prevSelection = (state) => {
  if (state.groupSelection < 0) {
    return [
      state.groups.length - 1,
      state.groups[state.groups.length - 1].items.length - 1
    ];
  }
  if (state.groupSelection === 0 && state.itemSelection === 0) {
    return [-1, -1];
  } else if (state.itemSelection === 0) {
    return [
      state.groupSelection - 1,
      state.groups[state.groupSelection - 1].items.length - 1
    ];
  }
  return [state.groupSelection, state.itemSelection - 1];
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.COMPLETION_SET_ITEMS:
    return Object.assign({}, state, {
      groups: action.groups,
      groupSelection: -1,
      itemSelection: -1,
    });
  case actions.COMPLETION_SELECT_NEXT: {
    let next = nextSelection(state);
    return Object.assign({}, state, {
      groupSelection: next[0],
      itemSelection: next[1],
    });
  }
  case actions.COMPLETION_SELECT_PREV: {
    let next = prevSelection(state);
    return Object.assign({}, state, {
      groupSelection: next[0],
      itemSelection: next[1],
    });
  }
  default:
    return defaultState;
  }
}
