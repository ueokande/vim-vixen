import './add-button.scss';
import { h, Component } from 'preact';

class AddButton extends Component {
  render() {
    return <input
      className='ui-add-button' type='button' value='&#x271a;'
      {...this.props} />;
  }
}

export default AddButton;
