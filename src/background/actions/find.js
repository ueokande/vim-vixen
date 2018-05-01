import actions from './index';

const setKeyword = (keyword) => {
  return {
    type: actions.FIND_SET_KEYWORD,
    keyword,
  };
};

export { setKeyword };
