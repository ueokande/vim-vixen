import './site.scss';
import { h, Component } from 'preact';
import Input from './ui/input';
import * as settingActions from 'settings/actions/setting';
import * as validator from 'shared/validators/setting';

const KeyMapFields = [
  [
    ['scroll.vertically?{count:-1}', 'Scroll down'],
    ['scroll.vertically?{count:1}', 'Scroll up'],
    ['scroll.horizonally?{count:-1}', 'Scroll left'],
    ['scroll.horizonally?{count:1}', 'Scroll right'],
    ['scroll.home', 'Scroll leftmost'],
    ['scroll.end', 'Scroll last'],
    ['scroll.pages?{count:-0.5}', 'Scroll up by half of screen'],
    ['scroll.pages?{count:0.5}', 'Scroll up by half of screen'],
    ['scroll.pages?{count:-1}', 'Scroll up by a screen'],
    ['scroll.pages?{count:1}', 'Scroll up by a screen'],
  ], [
    ['tabs.close', 'Close a tab'],
    ['tabs.reopen', 'Reopen closed tab'],
    ['tabs.next?{count:1}', 'Select next Tab'],
    ['tabs.prev?{count:1}', 'Select prev Tab'],
    ['tabs.first', 'Select first tab'],
    ['tabs.last', 'Select last tab'],
    ['tabs.reload?{cache:true}', 'Reload current tab'],
    ['tabs.pin.toggle', 'Toggle pinned state'],
    ['tabs.duplicate', 'Dupplicate a tab'],
  ], [
    ['follow.start?{newTab:false}', 'Follow a link'],
    ['follow.start?{newTab:true}', 'Follow a link in new tab'],
    ['navigate.histories.prev', 'Go back in histories'],
    ['navigate.histories.next', 'Go forward in histories'],
    ['navigate.link.next', 'Open next link'],
    ['navigate.link.prev', 'Open previous link'],
    ['navigate.parent', 'Go to parent directory'],
    ['navigate.root', 'Go to root directory'],
  ], [
    ['find.start', 'Start find mode'],
    ['find.next', 'Find next word'],
    ['find.prev', 'Find previous word'],
  ], [
    ['command.show', 'Open console'],
    ['command.show.open?{alter:false}', 'Open URL'],
    ['command.show.open?{alter:true}', 'Alter URL'],
    ['command.show.tabopen?{alter:false}', 'Open URL in new Tab'],
    ['command.show.tabopen?{alter:true}', 'Alter URL in new Tab'],
    ['command.show.winopen?{alter:false}', 'Open URL in new window'],
    ['command.show.winopen?{alter:true}', 'Alter URL in new window'],
    ['command.show.buffer', 'Open buffer command'],
  ], [
    ['addon.toggle.enabled', 'Enable or disable'],
    ['urls.yank', 'Copy current URL'],
    ['zoom.in', 'Zoom-in'],
    ['zoom.out', 'Zoom-out'],
    ['zoom.neutral', 'Reset zoom level'],
  ]
];

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
    let keymapFields = KeyMapFields.map((group, index) => {
      return <div key={index} className='keymap-fields-group'>
        {
          group.map((field) => {
            let name = field[0];
            let label = field[1];
            let value = this.state.settings.form.keymaps[name];
            return <Input
              type='text'
              id={name}
              name={name}
              key={name}
              label={label}
              value={value}
              onChange={this.bindFormKeymapsValue.bind(this)}
            />;
          })
        }
      </div>;
    });

    return <div>
      <fieldset>
        <legend>Keybindings</legend>
        <div className='keymap-fields'>
          { keymapFields }
        </div>
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
        onBlur={this.save.bind(this)}
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

  bindFormKeymapsValue(e) {
    let next = Object.assign({}, this.state);

    next.settings.form.keymaps[e.target.name] = e.target.value;

    this.context.store.dispatch(settingActions.save(next.settings));
  }

  save() {
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
