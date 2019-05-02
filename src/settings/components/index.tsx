import './site.scss';
import React from 'react';
import { connect } from 'react-redux';
import Input from './ui/Input';
import SearchForm from './form/SearchForm';
import KeymapsForm from './form/KeymapsForm';
import BlacklistForm from './form/BlacklistForm';
import PropertiesForm from './form/PropertiesForm';
import * as properties from '../../shared/settings/properties';
import * as settingActions from '../../settings/actions/setting';

const DO_YOU_WANT_TO_CONTINUE =
  'Some settings in JSON can be lost when migrating.  ' +
  'Do you want to continue?';

interface Props {
  source: string;
  json: string;
  form: any;
  error: string;

  // FIXME
  store: any;
}

class SettingsComponent extends React.Component<Props> {
  componentDidMount() {
    this.props.dispatch(settingActions.load());
  }

  renderFormFields(form: any) {
    return <div>
      <fieldset>
        <legend>Keybindings</legend>
        <KeymapsForm
          value={form.keymaps}
          onChange={value => this.bindForm('keymaps', value)}
          onBlur={this.save.bind(this)}
        />
      </fieldset>
      <fieldset>
        <legend>Search Engines</legend>
        <SearchForm
          value={form.search}
          onChange={value => this.bindForm('search', value)}
          onBlur={this.save.bind(this)}
        />
      </fieldset>
      <fieldset>
        <legend>Blacklist</legend>
        <BlacklistForm
          value={form.blacklist}
          onChange={value => this.bindForm('blacklist', value)}
          onBlur={this.save.bind(this)}
        />
      </fieldset>
      <fieldset>
        <legend>Properties</legend>
        <PropertiesForm
          types={properties.types}
          value={form.properties}
          onChange={value => this.bindForm('properties', value)}
          onBlur={this.save.bind(this)}
        />
      </fieldset>
    </div>;
  }

  renderJsonFields(json: string, error: string) {
    return <div>
      <Input
        type='textarea'
        name='json'
        label='Plain JSON'
        spellCheck={false}
        error={error}
        onValueChange={this.bindJson.bind(this)}
        onBlur={this.save.bind(this)}
        value={json}
      />
    </div>;
  }

  render() {
    let fields = null;
    let disabled = this.props.error.length > 0;
    if (this.props.source === 'form') {
      fields = this.renderFormFields(this.props.form);
    } else if (this.props.source === 'json') {
      fields = this.renderJsonFields(this.props.json, this.props.error);
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

  bindForm(name: string, value: any) {
    let settings = {
      source: this.props.source,
      json: this.props.json,
      form: { ...this.props.form },
    };
    settings.form[name] = value;
    this.props.dispatch(settingActions.set(settings));
  }

  bindJson(_name: string, value: string) {
    let settings = {
      source: this.props.source,
      json: value,
      form: this.props.form,
    };
    this.props.dispatch(settingActions.set(settings));
  }

  bindSource(_name: string, value: string) {
    let from = this.props.source;
    if (from === 'form' && value === 'json') {
      this.props.dispatch(settingActions.switchToJson(this.props.form));
    } else if (from === 'json' && value === 'form') {
      let b = window.confirm(DO_YOU_WANT_TO_CONTINUE);
      if (!b) {
        this.forceUpdate();
        return;
      }
      this.props.dispatch(settingActions.switchToForm(this.props.json));
    }
  }

  save() {
    let settings = this.props.store.getState();
    this.props.dispatch(settingActions.save(settings));
  }
}

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps)(SettingsComponent);
