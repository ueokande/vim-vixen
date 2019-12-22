import './KeymapsForm.scss';
import React from 'react';
import Input from '../ui/Input';
import keymaps from '../../keymaps';
import { FormKeymaps } from '../../../shared/SettingData';

interface Props {
  value: FormKeymaps;
  onChange: (e: FormKeymaps) => void;
  onBlur: () => void;
}

class KeymapsForm extends React.Component<Props> {
  public static defaultProps: Props = {
    value: FormKeymaps.fromJSON({}),
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    const values = this.props.value.toJSON();
    return <div className='form-keymaps-form'>
      {
        keymaps.fields.map((group, index) => {
          return <div key={index} className='form-keymaps-form-field-group'>
            {
              group.map(([name, label]) => {
                const value = values[name] || '';
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
    this.props.onChange(this.props.value.buildWithOverride(name, value));
  }
}

export default KeymapsForm;
