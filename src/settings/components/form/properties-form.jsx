import './properties-form.scss';
import { h, Component } from 'preact';

class PropertiesForm extends Component {

  render() {
    let types = this.props.types;
    let value = this.props.value;
    if (!value) {
      value = {};
    }

    return <div className='form-properties-form'>
      {
        Object.keys(types).map((name) => {
          let type = types[name];
          let inputType = null;
          if (type === 'string') {
            inputType = 'text';
          } else if (type === 'number') {
            inputType = 'number';
          } else if (type === 'boolean') {
            inputType = 'checkbox';
          }
          return <div key={name} className='form-properties-form-row'>
            <label>
              <span className='column-name'>{name}</span>
              <input type={inputType} name={name}
                className='column-input'
                value={value[name] ? value[name] : ''}
                onChange={this.bindValue.bind(this)}
                checked={value[name]}
              />
            </label>
          </div>;
        })
      }
    </div>;
  }

  bindValue(e) {
    if (!this.props.onChange) {
      return;
    }

    let name = e.target.name;
    let next = Object.assign({}, this.props.value);
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
