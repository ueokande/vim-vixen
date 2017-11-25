import './blacklist-form.scss';
import DeleteButton from '../ui/delete-button';
import { h, Component } from 'preact';

class BlacklistForm extends Component {

  render() {
    let value = this.props.value;
    if (!value) {
      value = [];
    }

    return <div className='form-blacklist-form'>
      {
        value.map((url, index) => {
          return <div key={index} className='form-blacklist-form-row'>
            <input data-index={index} type='text' name='url'
              className='column-url' value={url}
              onChange={this.bindValue.bind(this)} />
            <DeleteButton data-index={index} name='delete'
              onClick={this.bindValue.bind(this)} />
          </div>;
        })
      }
    </div>;
  }

  bindValue(e) {
    if (!this.props.onChange) {
      return;
    }

    let name = e.target.name;
    let index = e.target.getAttribute('data-index');
    let next = this.props.value.slice();

    if (name === 'url') {
      next[index] = e.target.value;
    } else if (name === 'delete') {
      next.splice(index, 1);
    }

    this.props.onChange(next);
  }
}

export default BlacklistForm;
