import './DeleteButton.scss';
import React from 'react';

interface Props extends React.AllHTMLAttributes<HTMLInputElement> {
}

class DeleteButton extends React.Component<Props> {
  render() {
    return <input
      className='ui-delete-button' type='button' value='&#x2716;'
      {...this.props} />;
  }
}

export default DeleteButton;
