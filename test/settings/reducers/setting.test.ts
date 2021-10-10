import * as actions from "../../../src/settings/actions";
import settingReducer from "../../../src/settings/reducers/setting";
import {
  FormSettings,
  JSONTextSettings,
  SettingSource,
} from "../../../src/shared/SettingData";
import { DefaultSetting } from "../../../src/shared/settings/Settings";

describe("settings setting reducer", () => {
  it("return the initial state", () => {
    const state = settingReducer(undefined, {} as any);
    expect(state).toHaveProperty("source", "json");
    expect(state).toHaveProperty("error", "");
  });

  it("return next state for SETTING_SET_SETTINGS", () => {
    const action: actions.SettingAction = {
      type: actions.SETTING_SET_SETTINGS,
      source: SettingSource.JSON,
      json: JSONTextSettings.fromText('{ "key": "value" }'),
      form: FormSettings.fromSettings(DefaultSetting),
    };
    const state = settingReducer(undefined, action);
    expect(state.source).toEqual("json");
    expect(state.json!.toJSONText()).toEqual('{ "key": "value" }');
    expect(state.form).toEqual(action.form);
  });

  it("return next state for SETTING_SHOW_ERROR", () => {
    const action: actions.SettingAction = {
      type: actions.SETTING_SHOW_ERROR,
      error: "bad value",
      json: JSONTextSettings.fromText("{}"),
    };
    const state = settingReducer(undefined, action);
    expect(state.error).toEqual("bad value");
    expect(state.json!.toJSONText()).toEqual("{}");
  });

  it("return next state for SETTING_SWITCH_TO_FORM", () => {
    const action: actions.SettingAction = {
      type: actions.SETTING_SWITCH_TO_FORM,
      form: FormSettings.fromSettings(DefaultSetting),
    };
    const state = settingReducer(undefined, action);
    expect(state.form).toEqual(action.form);
    expect(state.source).toEqual("form");
  });

  it("return next state for SETTING_SWITCH_TO_JSON", () => {
    const action: actions.SettingAction = {
      type: actions.SETTING_SWITCH_TO_JSON,
      json: JSONTextSettings.fromText("{}"),
    };
    const state = settingReducer(undefined, action);
    expect(state.json!.toJSONText()).toEqual("{}");
    expect(state.source).toEqual(SettingSource.JSON);
  });
});
