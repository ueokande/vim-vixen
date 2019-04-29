import './KeymapsForm.scss';
import React from 'react';
import Input from '../ui/Input';
import keymaps from '../../keymaps';

class KeymapsForm extends React.Component {

  render() {
    let values = this.props.value;
    if (!values) {
      values = {};
    }
    return <div className='form-keymaps-form'>
      {
        keymaps.fields.map((group, index) => {
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

    let next = { ...this.props.value };
    next[e.target.name] = e.target.value;

    this.props.onChange(next);
  }
}

export default KeymapsForm;
