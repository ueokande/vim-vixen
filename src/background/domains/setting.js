import DefaultSettings from '../../shared/settings/default';
import * as settingsValues from '../../shared/settings/values';

export default class Setting {
  constructor({ source, json, form }) {
    this.obj = {
      source, json, form
    };
  }

  get source() {
    return this.obj.source;
  }

  get json() {
    return this.obj.json;
  }

  get form() {
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

  serialize() {
    return this.obj;
  }

  static deserialize(obj) {
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
