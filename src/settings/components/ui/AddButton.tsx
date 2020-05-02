import "./AddButton.scss";
import React from "react";

type Props = React.AllHTMLAttributes<HTMLInputElement>;

class AddButton extends React.Component<Props> {
  render() {
    return (
      <input
        className="ui-add-button"
        type="button"
        value="&#x271a;"
        {...this.props}
      />
    );
  }
}

export default AddButton;
