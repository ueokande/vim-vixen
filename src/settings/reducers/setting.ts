import * as actions from '../actions';
import {
  JSONSettings, FormSettings, SettingSource,
} from '../../shared/SettingData';

export interface State {
  source: SettingSource;
  json?: JSONSettings;
  form?: FormSettings;
  error: string;
}

const defaultState: State = {
  source: SettingSource.JSON,
  json: JSONSettings.valueOf(''),
  error: '',
};

export default function reducer(
  state = defaultState,
  action: actions.SettingAction,
): State {
  switch (action.type) {
  case actions.SETTING_SET_SETTINGS:
    return { ...state,
      source: action.source,
      json: action.json,
      form: action.form,
      error: '', };
  case actions.SETTING_SHOW_ERROR:
    return { ...state,
      error: action.error,
      json: action.json, };
  case actions.SETTING_SWITCH_TO_FORM:
    return { ...state,
      error: '',
      source: SettingSource.Form,
      form: action.form, };
  case actions.SETTING_SWITCH_TO_JSON:
    return { ...state,
      error: '',
      source: SettingSource.JSON,
      json: action.json, };
  default:
    return state;
  }
}
