import './AddButton.scss';
import React from 'react';

interface Props extends React.AllHTMLAttributes<HTMLInputElement> {
}

class AddButton extends React.Component<Props> {
  render() {
    return <input
      className='ui-add-button' type='button' value='&#x271a;'
      {...this.props} />;
  }
}

export default AddButton;
