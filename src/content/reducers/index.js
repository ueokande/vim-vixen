import addonReducer from './addon';
import findReducer from './find';
import settingReducer from './setting';
import inputReducer from './input';
import followControllerReducer from './follow-controller';

// Make setting reducer instead of re-use
const defaultState = {
  addon: addonReducer(undefined, {}),
  find: findReducer(undefined, {}),
  setting: settingReducer(undefined, {}),
  input: inputReducer(undefined, {}),
  followController: followControllerReducer(undefined, {}),
};

export default function reducer(state = defaultState, action = {}) {
  return Object.assign({}, state, {
    addon: addonReducer(state.addon, action),
    find: findReducer(state.find, action),
    setting: settingReducer(state.setting, action),
    input: inputReducer(state.input, action),
    followController: followControllerReducer(state.followController, action),
  });
}
