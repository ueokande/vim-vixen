import actions from 'actions';

const setItems = (groups) => {
  return {
    type: actions.COMPLETION_SET_ITEMS,
    groups,
  };
};

const selectNext = () => {
  return {
    type: actions.COMPLETION_SELECT_NEXT
  };
};

const selectPrev = () => {
  return {
    type: actions.COMPLETION_SELECT_PREV
  };
};

export { setItems, selectNext, selectPrev };
