import './search-form.scss';
import { h, Component } from 'preact';
import AddButton from '../ui/add-button';
import DeleteButton from '../ui/delete-button';

class SearchForm extends Component {

  render() {
    let value = this.props.value;
    if (!value) {
      value = { default: '', engines: []};
    }
    if (!value.engines) {
      value.engines = [];
    }

    return <div className='form-search-form'>
      <div className='form-search-form-header'>
        <div className='column-name'>Name</div>
        <div className='column-url'>URL</div>
        <div className='column-option'>Default</div>
      </div>
      {
        value.engines.map((engine, index) => {
          return <div key={index} className='form-search-form-row'>
            <input data-index={index} type='text' name='name'
              className='column-name' value={engine[0]}
              onChange={this.bindValue.bind(this)} />
            <input data-index={index} type='text' name='url'
              placeholder='http://example.com/?q={}'
              className='column-url' value={engine[1]}
              onChange={this.bindValue.bind(this)} />
            <div className='column-option'>
              <input data-index={index} type='radio' name='default'
                checked={value.default === engine[0]}
                onChange={this.bindValue.bind(this)} />
              <DeleteButton data-index={index} name='delete'
                onClick={this.bindValue.bind(this)} />
            </div>
          </div>;
        })
      }
      <AddButton name='add' style='float:right'
        onClick={this.bindValue.bind(this)} />
    </div>;
  }

  bindValue(e) {
    if (!this.props.onChange) {
      return;
    }

    let value = this.props.value;
    let name = e.target.name;
    let index = e.target.getAttribute('data-index');
    let next = Object.assign({}, {
      default: value.default,
      engines: value.engines ? value.engines.slice() : [],
    });

    if (name === 'name') {
      next.engines[index][0] = e.target.value;
      next.default = this.props.value.engines[index][0];
    } else if (name === 'url') {
      next.engines[index][1] = e.target.value;
    } else if (name === 'default') {
      next.default = this.props.value.engines[index][0];
    } else if (name === 'add') {
      next.engines.push(['', '']);
    } else if (name === 'delete') {
      next.engines.splice(index, 1);
    }

    this.props.onChange(next);
  }
}

export default SearchForm;
