import { h, Component } from 'preact';
import './input.scss';

class Input extends Component {

  renderRadio(props) {
    let inputClasses = 'form-field-input';
    if (props.error) {
      inputClasses += ' input-error';
    }
    return <div>
      <label>
        <input className={ inputClasses } type='radio' {...props} />
        { props.label }
      </label>
    </div>;
  }

  renderTextArea(props) {
    let inputClasses = 'form-field-input';
    if (props.error) {
      inputClasses += ' input-error';
    }
    return <div>
      <label
        className='form-field-label'
        htmlFor={props.id}
      >{ props.label }</label>
      <textarea className={inputClasses} {...props} />

      <p className='form-field-error'>{ this.props.error }</p>
    </div>;
  }

  render() {
    let { type } = this.props;

    switch (this.props.type) {
    case 'radio':
      return this.renderRadio(this.props);
    case 'textarea':
      return this.renderTextArea(this.props);
    default:
      console.warn(`Unsupported input type ${type}`);
    }
    return null;
  }
}

export default Input;
