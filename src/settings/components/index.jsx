import './site.scss';
import { h, Component } from 'preact';
import Input from './ui/input';
import SearchEngineForm from './form/search-engine-form';
import KeymapsForm from './form/keymaps-form';
import BlacklistForm from './form/blacklist-form';
import * as settingActions from 'settings/actions/setting';
import * as validator from 'shared/validators/setting';

class SettingsComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      settings: {
        json: '',
      },
      errors: {
        json: '',
      }
    };
    this.context.store.subscribe(this.stateChanged.bind(this));
  }

  componentDidMount() {
    this.context.store.dispatch(settingActions.load());
  }

  stateChanged() {
    let settings = this.context.store.getState();
    this.setState({
      settings: {
        source: settings.source,
        json: settings.json,
        form: settings.form,
      }
    });
  }

  renderFormFields() {
    return <div>
      <fieldset>
        <legend>Keybindings</legend>
        <KeymapsForm
          value={this.state.settings.form.keymaps}
          onChange={value => this.bindForm('keymaps', value)}
        />
      </fieldset>
      <fieldset>
        <legend>Search Engines</legend>
        <SearchEngineForm
          value={this.state.settings.form.search}
          onChange={value => this.bindForm('search', value)}
        />
      </fieldset>
      <fieldset>
        <legend>Blacklist</legend>
        <BlacklistForm
          value={this.state.settings.form.blacklist}
          onChange={value => this.bindForm('blacklist', value)}
        />
      </fieldset>
    </div>;
  }

  renderJsonFields() {
    return <div>
      <Input
        type='textarea'
        name='json'
        label='Plane JSON'
        spellCheck='false'
        error={this.state.errors.json}
        onChange={this.bindValue.bind(this)}
        value={this.state.settings.json}
      />
    </div>;
  }

  render() {
    let fields = null;
    if (this.state.settings.source === 'form') {
      fields = this.renderFormFields();
    } else if (this.state.settings.source === 'json') {
      fields = this.renderJsonFields();
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
            checked={this.state.settings.source === 'form'}
            value='form'
            onChange={this.bindValue.bind(this)} />

          <Input
            type='radio'
            name='source'
            label='Use plain JSON'
            checked={this.state.settings.source === 'json'}
            value='json'
            onChange={this.bindValue.bind(this)} />

          { fields }
        </form>
      </div>
    );
  }

  validate(target) {
    if (target.name === 'json') {
      let settings = JSON.parse(target.value);
      validator.validate(settings);
    }
  }

  bindForm(name, value) {
    let next = Object.assign({}, this.state, {
      settings: Object.assign({}, this.state.settings, {
        form: Object.assign({}, this.state.settings.form)
      })
    });
    next.settings.form[name] = value;
    this.setState(next);
    this.context.store.dispatch(settingActions.save(next.settings));
  }

  bindValue(e) {
    let next = Object.assign({}, this.state);

    next.errors.json = '';
    try {
      this.validate(e.target);
    } catch (err) {
      next.errors.json = err.message;
    }
    next.settings[e.target.name] = e.target.value;

    this.setState(next);
    this.context.store.dispatch(settingActions.save(next.settings));
  }
}

export default SettingsComponent;
