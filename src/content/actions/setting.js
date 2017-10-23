import actions from 'content/actions';

const set = (value) => {
  return {
    type: actions.SETTING_SET,
    value,
  };
};

export { set };
