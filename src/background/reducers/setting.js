import actions from 'background/actions';

const defaultState = {
  value: {},
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.SETTING_SET_SETTINGS:
    return {
      value: action.value,
    };
  case actions.SETTING_SET_PROPERTY:
    return {
      value: Object.assign({}, state.value, {
        properties: Object.assign({}, state.value.properties,
          { [action.name]: action.value })
      })
    };
  default:
    return state;
  }
}

