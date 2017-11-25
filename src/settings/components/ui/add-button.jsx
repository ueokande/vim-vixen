import './add-button.scss';
import { h, Component } from 'preact';

class AddButton extends Component {
  render() {
    return <input
      className='ui-add-button' type='button' value='Add'
      {...this.props} />;
  }
}

export default AddButton;
