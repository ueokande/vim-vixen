import './KeymapsForm.scss';
import React from 'react';
import Input from '../ui/Input';
import keymaps from '../../keymaps';

type Value = {[key: string]: string};

interface Props{
  value: Value;
  onChange: (e: Value) => void;
  onBlur: () => void;
}

class KeymapsForm extends React.Component<Props> {
  public static defaultProps: Props = {
    value: {},
    onChange: () => {},
    onBlur: () => {},
  }

  render() {
    return <div className='form-keymaps-form'>
      {
        keymaps.fields.map((group, index) => {
          return <div key={index} className='form-keymaps-form-field-group'>
            {
              group.map((field) => {
                let name = field[0];
                let label = field[1];
                let value = this.props.value[name] || '';
                return <Input
                  type='text' id={name} name={name} key={name}
                  label={label} value={value}
                  onValueChange={this.bindValue.bind(this)}
                  onBlur={this.props.onBlur}
                />;
              })
            }
          </div>;
        })
      }
    </div>;
  }

  bindValue(name: string, value: string) {
    let next = { ...this.props.value };
    next[name] = value;

    this.props.onChange(next);
  }
}

export default KeymapsForm;
