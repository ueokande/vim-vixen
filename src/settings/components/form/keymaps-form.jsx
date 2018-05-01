import './keymaps-form.scss';
import { h, Component } from 'preact';
import Input from '../ui/input';

const KeyMapFields = [
  [
    ['scroll.vertically?{"count":1}', 'Scroll down'],
    ['scroll.vertically?{"count":-1}', 'Scroll up'],
    ['scroll.horizonally?{"count":-1}', 'Scroll left'],
    ['scroll.horizonally?{"count":1}', 'Scroll right'],
    ['scroll.home', 'Scroll to leftmost'],
    ['scroll.end', 'Scroll to rightmost'],
    ['scroll.top', 'Scroll to top'],
    ['scroll.bottom', 'Scroll to bottom'],
    ['scroll.pages?{"count":-0.5}', 'Scroll up by half of screen'],
    ['scroll.pages?{"count":0.5}', 'Scroll down by half of screen'],
    ['scroll.pages?{"count":-1}', 'Scroll up by a screen'],
    ['scroll.pages?{"count":1}', 'Scroll down by a screen'],
  ], [
    ['tabs.close', 'Close a tab'],
    ['tabs.reopen', 'Reopen closed tab'],
    ['tabs.next?{"count":1}', 'Select next Tab'],
    ['tabs.prev?{"count":1}', 'Select prev Tab'],
    ['tabs.first', 'Select first tab'],
    ['tabs.last', 'Select last tab'],
    ['tabs.reload?{"cache":false}', 'Reload current tab'],
    ['tabs.reload?{"cache":true}', 'Reload with no caches'],
    ['tabs.pin.toggle', 'Toggle pinned state'],
    ['tabs.duplicate', 'Duplicate a tab'],
  ], [
    ['follow.start?{"newTab":false}', 'Follow a link'],
    ['follow.start?{"newTab":true}', 'Follow a link in new tab'],
    ['navigate.history.prev', 'Go back in histories'],
    ['navigate.history.next', 'Go forward in histories'],
    ['navigate.link.next', 'Open next link'],
    ['navigate.link.prev', 'Open previous link'],
    ['navigate.parent', 'Go to parent directory'],
    ['navigate.root', 'Go to root directory'],
    ['focus.input', 'Focus input'],
  ], [
    ['find.start', 'Start find mode'],
    ['find.next', 'Find next word'],
    ['find.prev', 'Find previous word'],
  ], [
    ['command.show', 'Open console'],
    ['command.show.open?{"alter":false}', 'Open URL'],
    ['command.show.open?{"alter":true}', 'Alter URL'],
    ['command.show.tabopen?{"alter":false}', 'Open URL in new Tab'],
    ['command.show.tabopen?{"alter":true}', 'Alter URL in new Tab'],
    ['command.show.winopen?{"alter":false}', 'Open URL in new window'],
    ['command.show.winopen?{"alter":true}', 'Alter URL in new window'],
    ['command.show.buffer', 'Open buffer command'],
  ], [
    ['addon.toggle.enabled', 'Enable or disable'],
    ['urls.yank', 'Copy current URL'],
    ['urls.paste?{"newTab":false}', 'Open clipboard\'s URL in current tab'],
    ['urls.paste?{"newTab":true}', 'Open clipboard\'s URL in new tab'],
    ['zoom.in', 'Zoom-in'],
    ['zoom.out', 'Zoom-out'],
    ['zoom.neutral', 'Reset zoom level'],
  ]
];

const AllowdOps = [].concat(...KeyMapFields.map(group => group.map(e => e[0])));

class KeymapsForm extends Component {

  render() {
    let values = this.props.value;
    if (!values) {
      values = {};
    }
    return <div className='form-keymaps-form'>
      {
        KeyMapFields.map((group, index) => {
          return <div key={index} className='form-keymaps-form-field-group'>
            {
              group.map((field) => {
                let name = field[0];
                let label = field[1];
                let value = values[name];
                return <Input
                  type='text' id={name} name={name} key={name}
                  label={label} value={value}
                  onChange={this.bindValue.bind(this)}
                />;
              })
            }
          </div>;
        })
      }
    </div>;
  }

  bindValue(e) {
    if (!this.props.onChange) {
      return;
    }

    let next = Object.assign({}, this.props.value);
    next[e.target.name] = e.target.value;

    this.props.onChange(next);
  }
}

KeymapsForm.AllowdOps = AllowdOps;

export default KeymapsForm;
