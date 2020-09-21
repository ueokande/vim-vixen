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
  renderRadio(props: Props) {
    const inputClassName = props.error ? "input-error" : "";
    const pp = { ...props };
    delete pp.onValueChange;
    return (
      <div className="settings-ui-input">
        <label>
          <input
            type="radio"
            className={inputClassName}
            onChange={this.bindOnChange.bind(this)}
            {...pp}
          />
          {props.label}
        </label>
      </div>
    );
  }

  render() {
    return this.renderRadio(this.props);
  }

  bindOnChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (this.props.onValueChange) {
      this.props.onValueChange(e.target.name, e.target.value);
    }
  }
}

export default Input;
