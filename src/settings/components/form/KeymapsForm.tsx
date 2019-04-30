import './KeymapsForm.scss';
import React from 'react';
import PropTypes from 'prop-types';
import Input from '../ui/Input';
import keymaps from '../../keymaps';

class KeymapsForm extends React.Component {

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
                  onChange={this.bindValue.bind(this)}
                  onBlur={this.props.onBlur}
                />;
              })
            }
          </div>;
        })
      }
    </div>;
  }

  bindValue(e) {
    let next = { ...this.props.value };
    next[e.target.name] = e.target.value;

    this.props.onChange(next);
  }
}

KeymapsForm.propTypes = {
  value: PropTypes.objectOf(PropTypes.string),
  onChange: PropTypes.func,
};

KeymapsForm.defaultProps = {
  value: {},
  onChange: () => {},
};

export default KeymapsForm;
