import * as tabs from '../tabs';

const getCompletions = (keyword, excludePinned) => {
  return tabs.queryByKeyword(keyword, excludePinned);
};


export { getCompletions };
