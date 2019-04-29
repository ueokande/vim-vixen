import './add-button.scss';
import React from 'react';

class AddButton extends React.Component {
  render() {
    return <input
      className='ui-add-button' type='button' value='&#x271a;'
      {...this.props} />;
  }
}

export default AddButton;
