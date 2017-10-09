import './site.scss';
import React from 'react';
import PropTypes from 'prop-types';
import * as settingActions from 'settings/actions/setting';
import { validate } from 'shared/validators/setting';

class SettingsComponent extends React.Component {
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
    this.setState({ settings });
  }

  render() {
    return (
      <div>
        <h1>Configure Vim-Vixen</h1>

        <form id='vimvixen-settings-form' className='vimvixen-settings-form'
          onSubmit={this.saveSettings.bind(this)}>
          <label htmlFor='load-from-json'>Load from JSON:</label>
          <textarea name='plain-json' spellCheck='false'
            onInput={this.onPlainJsonChanged.bind(this)}
            onChange={this.bindValue.bind(this)}
            value={this.state.settings.json} />
          <button type='submit'>Save</button>
        </form>
      </div>
    );
  }

  saveSettings(e) {
    let settings = {
      json: e.target.elements['plain-json'].value,
    };
    this.context.store.dispatch(settingActions.save(settings));
    e.preventDefault();
  }

  onPlainJsonChanged(e) {
    try {
      let settings = JSON.parse(e.target.value);
      validate(settings);
      e.target.setCustomValidity('');
    } catch (err) {
      e.target.setCustomValidity(err.message);
    }
  }

  bindValue(e) {
    let next = Object.assign({}, this.state, {
      settings: {
        'json': e.target.value,
      }
    });
    this.setState(next);
  }
}

SettingsComponent.contextTypes = {
  store: PropTypes.any,
};

export default SettingsComponent;
