import * as actions from "../../../src/settings/actions";
import settingReducer from "../../../src/settings/reducers/setting";
import { expect } from "chai";
import {
  FormSettings,
  JSONTextSettings,
  SettingSource,
} from "../../../src/shared/SettingData";
import { DefaultSetting } from "../../../src/shared/settings/Settings";

describe("settings setting reducer", () => {
  it("return the initial state", () => {
    const state = settingReducer(undefined, {} as any);
    expect(state).to.have.deep.property("source", "json");
    expect(state).to.have.deep.property("error", "");
  });

  it("return next state for SETTING_SET_SETTINGS", () => {
    const action: actions.SettingAction = {
      type: actions.SETTING_SET_SETTINGS,
      source: SettingSource.JSON,
      json: JSONTextSettings.fromText('{ "key": "value" }'),
      form: FormSettings.fromSettings(DefaultSetting),
    };
    const state = settingReducer(undefined, action);
    expect(state.source).to.equal("json");
    expect(state.json!.toJSONText()).to.equal('{ "key": "value" }');
    expect(state.form).to.deep.equal(action.form);
  });

  it("return next state for SETTING_SHOW_ERROR", () => {
    const action: actions.SettingAction = {
      type: actions.SETTING_SHOW_ERROR,
      error: "bad value",
      json: JSONTextSettings.fromText("{}"),
    };
    const state = settingReducer(undefined, action);
    expect(state.error).to.equal("bad value");
    expect(state.json!.toJSONText()).to.equal("{}");
  });

  it("return next state for SETTING_SWITCH_TO_FORM", () => {
    const action: actions.SettingAction = {
      type: actions.SETTING_SWITCH_TO_FORM,
      form: FormSettings.fromSettings(DefaultSetting),
    };
    const state = settingReducer(undefined, action);
    expect(state.form).to.deep.equal(action.form);
    expect(state.source).to.equal("form");
  });

  it("return next state for SETTING_SWITCH_TO_JSON", () => {
    const action: actions.SettingAction = {
      type: actions.SETTING_SWITCH_TO_JSON,
      json: JSONTextSettings.fromText("{}"),
    };
    const state = settingReducer(undefined, action);
    expect(state.json!.toJSONText()).to.equal("{}");
    expect(state.source).to.equal(SettingSource.JSON);
  });
});
