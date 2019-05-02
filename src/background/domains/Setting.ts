import DefaultSettings from '../../shared/settings/default';
import * as settingsValues from '../../shared/settings/values';

type SettingValue = {
    source: string,
    json: string,
    form: any
}

export default class Setting {
  private obj: SettingValue;

  constructor({ source, json, form }: SettingValue) {
    this.obj = {
      source, json, form
    };
  }

  get source(): string {
    return this.obj.source;
  }

  get json(): string {
    return this.obj.json;
  }

  get form(): any {
    return this.obj.form;
  }

  value() {
    let value = JSON.parse(DefaultSettings.json);
    if (this.obj.source === 'json') {
      value = settingsValues.valueFromJson(this.obj.json);
    } else if (this.obj.source === 'form') {
      value = settingsValues.valueFromForm(this.obj.form);
    }
    if (!value.properties) {
      value.properties = {};
    }
    return { ...settingsValues.valueFromJson(DefaultSettings.json), ...value };
  }

  serialize(): SettingValue {
    return this.obj;
  }

  static deserialize(obj: SettingValue): Setting {
    return new Setting({ source: obj.source, json: obj.json, form: obj.form });
  }

  static defaultSettings() {
    return new Setting({
      source: DefaultSettings.source,
      json: DefaultSettings.json,
      form: {},
    });
  }
}
