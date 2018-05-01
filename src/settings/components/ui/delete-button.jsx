import './delete-button.scss';
import { h, Component } from 'preact';

class DeleteButton extends Component {
  render() {
    return <input
      className='ui-delete-button' type='button' value='&#x2716;'
      {...this.props} />;
  }
}

export default DeleteButton;
