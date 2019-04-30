import './DeleteButton.scss';
import React from 'react';

class DeleteButton extends React.Component {
  render() {
    return <input
      className='ui-delete-button' type='button' value='&#x2716;'
      {...this.props} />;
  }
}

export default DeleteButton;
