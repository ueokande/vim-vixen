import './site.scss';
import { h, Component } from 'preact';
import Input from './ui/input';
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
      }
    });
  }

  render() {
    return (
      <div>
        <h1>Configure Vim-Vixen</h1>
        <form className='vimvixen-settings-form'>

          <Input
            type='radio'
            name='source'
            label='Use plain JSON'
            checked={this.state.settings.source === 'json'}
            value='json' />

          <Input
            type='textarea'
            name='json'
            label='Plane JSON'
            spellCheck='false'
            error={this.state.errors.json}
            onChange={this.bindValue.bind(this)}
            onBlur={this.bindAndSave.bind(this)}
            value={this.state.settings.json}
          />
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
