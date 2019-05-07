import React from 'react';
import './Input.scss';

interface Props extends React.AllHTMLAttributes<HTMLElement> {
  name: string;
  type: string;
  error?: string;
  label: string;
  value: string;
  onValueChange?: (name: string, value: string) => void;
  onBlur?: (e: React.FocusEvent<Element>) => void;
}

class Input extends React.Component<Props> {
  renderText(props: Props) {
    let inputClassName = props.error ? 'input-error' : '';
    let pp = { ...props };
    delete pp.onValueChange;
    return <div className='settings-ui-input'>
      <label htmlFor={props.id}>{ props.label }</label>
      <input
        type='text' className={inputClassName}
        onChange={this.bindOnChange.bind(this)}
        { ...pp } />
    </div>;
  }

  renderRadio(props: Props) {
    let inputClassName = props.error ? 'input-error' : '';
    let pp = { ...props };
    delete pp.onValueChange;
    return <div className='settings-ui-input'>
      <label>
        <input
          type='radio' className={inputClassName}
          onChange={this.bindOnChange.bind(this)}
          { ...pp } />
        { props.label }
      </label>
    </div>;
  }

  renderTextArea(props: Props) {
    let inputClassName = props.error ? 'input-error' : '';
    let pp = { ...props };
    delete pp.onValueChange;
    return <div className='settings-ui-input'>
      <label
        htmlFor={props.id}
      >{ props.label }</label>
      <textarea
        className={inputClassName}
        onChange={this.bindOnChange.bind(this)}
        { ...pp } />
      <p className='settings-ui-input-error'>{ this.props.error }</p>
    </div>;
  }

  render() {
    let { type } = this.props;

    switch (this.props.type) {
    case 'text':
      return this.renderText(this.props);
    case 'radio':
      return this.renderRadio(this.props);
    case 'textarea':
      return this.renderTextArea(this.props);
    default:
      console.warn(`Unsupported input type ${type}`);
    }
    return null;
  }

  bindOnChange(e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) {
    if (this.props.onValueChange) {
      this.props.onValueChange(e.target.name, e.target.value);
    }
  }
}

export default Input;
