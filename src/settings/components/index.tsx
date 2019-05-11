import './site.scss';
import React from 'react';
import { connect } from 'react-redux';
import Input from './ui/Input';
import SearchForm from './form/SearchForm';
import KeymapsForm from './form/KeymapsForm';
import BlacklistForm from './form/BlacklistForm';
import PropertiesForm from './form/PropertiesForm';
import * as settingActions from '../../settings/actions/setting';
import SettingData, {
  JSONSettings, FormKeymaps, FormSearch, FormSettings,
} from '../../shared/SettingData';
import { State as AppState } from '../reducers/setting';
import * as settings from '../../shared/Settings';
import * as PropertyDefs from '../../shared/property-defs';

const DO_YOU_WANT_TO_CONTINUE =
  'Some settings in JSON can be lost when migrating.  ' +
  'Do you want to continue?';

type StateProps = ReturnType<typeof mapStateToProps>;
interface DispatchProps {
  dispatch: (action: any) => void,
}
type Props = StateProps & DispatchProps & {
  // FIXME
  store: any;
};

class SettingsComponent extends React.Component<Props> {
  componentDidMount() {
    this.props.dispatch(settingActions.load());
  }

  renderFormFields(form: any) {
    let types = PropertyDefs.defs.reduce(
      (o: {[key: string]: string}, def) => {
        o[def.name] = def.type;
        return o;
      }, {});
    return <div>
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
        <legend>Properties</legend>
        <PropertiesForm
          types={types}
          value={form.properties}
          onChange={this.bindPropertiesForm.bind(this)}
          onBlur={this.save.bind(this)}
        />
      </fieldset>
    </div>;
  }

  renderJsonFields(json: JSONSettings, error: string) {
    return <div>
      <Input
        type='textarea'
        name='json'
        label='Plain JSON'
        spellCheck={false}
        error={error}
        onValueChange={this.bindJson.bind(this)}
        onBlur={this.save.bind(this)}
        value={json.toJSON()}
      />
    </div>;
  }

  render() {
    let fields = null;
    let disabled = this.props.error.length > 0;
    if (this.props.source === 'form') {
      fields = this.renderFormFields(this.props.form);
    } else if (this.props.source === 'json') {
      fields = this.renderJsonFields(
        this.props.json as JSONSettings, this.props.error);
    }
    return (
      <div>
        <h1>Configure Vim-Vixen</h1>
        <form className='vimvixen-settings-form'>
          <Input
            type='radio'
            id='setting-source-form'
            name='source'
            label='Use form'
            checked={this.props.source === 'form'}
            value='form'
            onValueChange={this.bindSource.bind(this)}
            disabled={disabled} />

          <Input
            type='radio'
            name='source'
            label='Use plain JSON'
            checked={this.props.source === 'json'}
            value='json'
            onValueChange={this.bindSource.bind(this)}
            disabled={disabled} />
          { fields }
        </form>
      </div>
    );
  }

  bindKeymapsForm(value: FormKeymaps) {
    let data = new SettingData({
      source: this.props.source,
      form: (this.props.form as FormSettings).buildWithKeymaps(value),
    });
    this.props.dispatch(settingActions.set(data));
  }

  bindSearchForm(value: any) {
    let data = new SettingData({
      source: this.props.source,
      form: (this.props.form as FormSettings).buildWithSearch(
        FormSearch.valueOf(value)),
    });
    this.props.dispatch(settingActions.set(data));
  }

  bindBlacklistForm(value: any) {
    let data = new SettingData({
      source: this.props.source,
      form: (this.props.form as FormSettings).buildWithBlacklist(
        settings.blacklistValueOf(value)),
    });
    this.props.dispatch(settingActions.set(data));
  }

  bindPropertiesForm(value: any) {
    let data = new SettingData({
      source: this.props.source,
      form: (this.props.form as FormSettings).buildWithProperties(
        settings.propertiesValueOf(value)),
    });
    this.props.dispatch(settingActions.set(data));
  }

  bindJson(_name: string, value: string) {
    let data = new SettingData({
      source: this.props.source,
      json: JSONSettings.valueOf(value),
    });
    this.props.dispatch(settingActions.set(data));
  }

  bindSource(_name: string, value: string) {
    let from = this.props.source;
    if (from === 'form' && value === 'json') {
      this.props.dispatch(settingActions.switchToJson(
        this.props.form as FormSettings));
    } else if (from === 'json' && value === 'form') {
      let b = window.confirm(DO_YOU_WANT_TO_CONTINUE);
      if (!b) {
        this.forceUpdate();
        return;
      }
      this.props.dispatch(
        settingActions.switchToForm(this.props.json as JSONSettings));
    }
  }

  save() {
    let { source, json, form } = this.props.store.getState();
    this.props.dispatch(settingActions.save(
      new SettingData({ source, json, form }),
    ));
  }
}

const mapStateToProps = (state: AppState) => ({ ...state });

export default connect(mapStateToProps)(SettingsComponent);
