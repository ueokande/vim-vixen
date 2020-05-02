import "./site.scss";
import React from "react";
import { connect } from "react-redux";
import Input from "./ui/Input";
import SearchForm from "./form/SearchForm";
import KeymapsForm from "./form/KeymapsForm";
import BlacklistForm from "./form/BlacklistForm";
import PropertiesForm from "./form/PropertiesForm";
import PartialBlacklistForm from "./form/PartialBlacklistForm";
import * as settingActions from "../../settings/actions/setting";
import SettingData, {
  FormKeymaps,
  FormSearch,
  FormSettings,
  JSONTextSettings,
} from "../../shared/SettingData";
import { State as AppState } from "../reducers/setting";
import Properties from "../../shared/settings/Properties";
import Blacklist from "../../shared/settings/Blacklist";

const DO_YOU_WANT_TO_CONTINUE =
  "Some settings in JSON can be lost when migrating.  " +
  "Do you want to continue?";

type StateProps = ReturnType<typeof mapStateToProps>;
interface DispatchProps {
  dispatch: (action: any) => void;
}
type Props = StateProps &
  DispatchProps & {
    // FIXME
    store: any;
  };

class SettingsComponent extends React.Component<Props> {
  componentDidMount() {
    this.props.dispatch(settingActions.load());
  }

  renderFormFields(form: FormSettings) {
    return (
      <div>
        <fieldset>
          <legend>Keybindings</legend>
          <KeymapsForm
            value={form.keymaps}
            onChange={this.bindKeymapsForm.bind(this)}
            onBlur={this.save.bind(this)}
          />
        </fieldset>
        <fieldset>
          <legend>Search Engines</legend>
          <SearchForm
            value={form.search}
            onChange={this.bindSearchForm.bind(this)}
            onBlur={this.save.bind(this)}
          />
        </fieldset>
        <fieldset>
          <legend>Blacklist</legend>
          <BlacklistForm
            value={form.blacklist}
            onChange={this.bindBlacklistForm.bind(this)}
            onBlur={this.save.bind(this)}
          />
        </fieldset>
        <fieldset>
          <legend>Partial blacklist</legend>
          <PartialBlacklistForm
            value={form.blacklist}
            onChange={this.bindBlacklistForm.bind(this)}
            onBlur={this.save.bind(this)}
          />
        </fieldset>
        <fieldset>
          <legend>Properties</legend>
          <PropertiesForm
            types={Properties.types()}
            value={form.properties.toJSON()}
            onChange={this.bindPropertiesForm.bind(this)}
            onBlur={this.save.bind(this)}
          />
        </fieldset>
      </div>
    );
  }

  renderJsonFields(json: JSONTextSettings, error: string) {
    return (
      <div>
        <Input
          type="textarea"
          name="json"
          label="Plain JSON"
          spellCheck={false}
          error={error}
          onValueChange={this.bindJson.bind(this)}
          onBlur={this.save.bind(this)}
          value={json.toJSONText()}
        />
      </div>
    );
  }

  render() {
    let fields = null;
    const disabled = this.props.error.length > 0;
    if (this.props.source === "form") {
      fields = this.renderFormFields(this.props.form!!);
    } else if (this.props.source === "json") {
      fields = this.renderJsonFields(this.props.json!!, this.props.error);
    }
    return (
      <div>
        <h1>Configure Vim-Vixen</h1>
        <form className="vimvixen-settings-form">
          <Input
            type="radio"
            id="setting-source-form"
            name="source"
            label="Use form"
            checked={this.props.source === "form"}
            value="form"
            onValueChange={this.bindSource.bind(this)}
            disabled={disabled}
          />

          <Input
            type="radio"
            name="source"
            label="Use plain JSON"
            checked={this.props.source === "json"}
            value="json"
            onValueChange={this.bindSource.bind(this)}
            disabled={disabled}
          />
          {fields}
        </form>
      </div>
    );
  }

  bindKeymapsForm(value: FormKeymaps) {
    const data = new SettingData({
      source: this.props.source,
      form: (this.props.form as FormSettings).buildWithKeymaps(value),
    });
    this.props.dispatch(settingActions.set(data));
  }

  bindSearchForm(value: any) {
    const data = new SettingData({
      source: this.props.source,
      form: (this.props.form as FormSettings).buildWithSearch(
        FormSearch.fromJSON(value)
      ),
    });
    this.props.dispatch(settingActions.set(data));
  }

  bindBlacklistForm(blacklist: Blacklist) {
    const data = new SettingData({
      source: this.props.source,
      form: (this.props.form as FormSettings).buildWithBlacklist(blacklist),
    });
    this.props.dispatch(settingActions.set(data));
  }

  bindPropertiesForm(value: any) {
    const data = new SettingData({
      source: this.props.source,
      form: (this.props.form as FormSettings).buildWithProperties(
        Properties.fromJSON(value)
      ),
    });
    this.props.dispatch(settingActions.set(data));
  }

  bindJson(_name: string, value: string) {
    const data = new SettingData({
      source: this.props.source,
      json: JSONTextSettings.fromText(value),
    });
    this.props.dispatch(settingActions.set(data));
  }

  bindSource(_name: string, value: string) {
    const from = this.props.source;
    if (from === "form" && value === "json") {
      this.props.dispatch(
        settingActions.switchToJson(this.props.form as FormSettings)
      );
      this.save();
    } else if (from === "json" && value === "form") {
      const b = window.confirm(DO_YOU_WANT_TO_CONTINUE);
      if (!b) {
        this.forceUpdate();
        return;
      }
      this.props.dispatch(
        settingActions.switchToForm(this.props.json as JSONTextSettings)
      );
      this.save();
    }
  }

  save() {
    const { source, json, form } = this.props.store.getState();
    this.props.dispatch(
      settingActions.save(new SettingData({ source, json, form }))
    );
  }
}

const mapStateToProps = (state: AppState) => ({ ...state });

export default connect(mapStateToProps)(SettingsComponent);
