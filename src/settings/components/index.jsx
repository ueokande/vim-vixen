import './site.scss';
import { h, Component } from 'preact';
import * as settingActions from 'settings/actions/setting';
import * as validator from 'shared/validators/setting';

class SettingsComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      settings: {
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
      }
    });
  }

  render() {
    return (
      <div>
        <h1>Configure Vim-Vixen</h1>
        <form className='vimvixen-settings-form'>

          <p>Load settings from:</p>
          <input type='radio' id='setting-source-json'
            name='source'
            value='json'
            onChange={this.bindAndSave.bind(this)}
            checked={this.state.settings.source === 'json'} />
          <label htmlFor='settings-source-json'>JSON</label>

          <textarea name='json' spellCheck='false'
            onInput={this.validate.bind(this)}
            onChange={this.bindValue.bind(this)}
            onBlur={this.bindAndSave.bind(this)}
            value={this.state.settings.json} />
        </form>
      </div>
    );
  }

  validate(e) {
    try {
      let settings = JSON.parse(e.target.value);
      validator.validate(settings);
      e.target.setCustomValidity('');
    } catch (err) {
      e.target.setCustomValidity(err.message);
    }
  }

  bindValue(e) {
    let nextSettings = Object.assign({}, this.state.settings);
    nextSettings[e.target.name] = e.target.value;

    this.setState({ settings: nextSettings });
  }

  bindAndSave(e) {
    this.bindValue(e);

    try {
      let json = this.state.settings.json;
      validator.validate(JSON.parse(json));
      this.context.store.dispatch(settingActions.save(this.state.settings));
    } catch (err) {
      // error already shown
    }
  }
}

export default SettingsComponent;
