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

class TextArea extends React.Component<Props> {
  renderTextArea(props: Props) {
    const inputClassName = props.error ? "input-error" : "";
    const pp = { ...props };
    delete pp.onValueChange;
    return (
      <div className="settings-ui-input">
        <label htmlFor={props.id}>{props.label}</label>
        <textarea
          className={inputClassName}
          onChange={this.bindOnChange.bind(this)}
          {...pp}
        />
        <p className="settings-ui-input-error">{this.props.error}</p>
      </div>
    );
  }

  render() {
    return this.renderTextArea(this.props);
  }

  bindOnChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (this.props.onValueChange) {
      this.props.onValueChange(e.target.name, e.target.value);
    }
  }
}

export default TextArea;
