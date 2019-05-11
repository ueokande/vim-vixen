import './PropertiesForm.scss';
import React from 'react';

interface Props {
  types: {[key: string]: string};
  value: {[key: string]: any};
  onChange: (value: any) => void;
  onBlur: () => void;
}

class PropertiesForm extends React.Component<Props> {
  public static defaultProps: Props = {
    types: {},
    value: {},
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    let types = this.props.types;
    let value = this.props.value;

    return <div className='form-properties-form'>
      {
        Object.keys(types).map((name) => {
          let type = types[name];
          let inputType = '';
          if (type === 'string') {
            inputType = 'text';
          } else if (type === 'number') {
            inputType = 'number';
          } else if (type === 'boolean') {
            inputType = 'checkbox';
          } else {
            return null;
          }
          return <div key={name} className='form-properties-form-row'>
            <label>
              <span className='column-name'>{name}</span>
              <input type={inputType} name={name}
                className='column-input'
                value={value[name] ? value[name] : ''}
                onChange={this.bindValue.bind(this)}
                onBlur={this.props.onBlur}
                checked={value[name]}
              />
            </label>
          </div>;
        })
      }
    </div>;
  }

  bindValue(e: React.ChangeEvent<HTMLInputElement>) {
    let name = e.target.name;
    let next = { ...this.props.value };
    if (e.target.type.toLowerCase() === 'checkbox') {
      next[name] = e.target.checked;
    } else if (e.target.type.toLowerCase() === 'number') {
      next[name] = Number(e.target.value);
    } else {
      next[name] = e.target.value;
    }

    this.props.onChange(next);
  }
}

export default PropertiesForm;
