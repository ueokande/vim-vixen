import React from "react";
import "./Input.scss";

interface Props extends React.AllHTMLAttributes<HTMLElement> {
  name: string;
  error?: string;
  label: string;
  value: string;
  onValueChange?: (name: string, value: string) => void;
  onBlur?: (e: React.FocusEvent<Element>) => void;
}

class Input extends React.Component<Props> {
  renderText(props: Props) {
    const inputClassName = props.error ? "input-error" : "";
    const pp = { ...props };
    delete pp.onValueChange;
    return (
      <div className="settings-ui-input">
        <label htmlFor={props.id}>{props.label}</label>
        <input
          type="text"
          className={inputClassName}
          onChange={this.bindOnChange.bind(this)}
          {...pp}
        />
      </div>
    );
  }

  render() {
    return this.renderText(this.props);
  }

  bindOnChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (this.props.onValueChange) {
      this.props.onValueChange(e.target.name, e.target.value);
    }
  }
}

export default Input;
