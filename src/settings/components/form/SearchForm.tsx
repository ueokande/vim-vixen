import './SearchForm.scss';
import React from 'react';
import AddButton from '../ui/AddButton';
import DeleteButton from '../ui/DeleteButton';
import { FormSearch } from '../../../shared/SettingData';

interface Props {
  value: FormSearch;
  onChange: (value: FormSearch) => void;
  onBlur: () => void;
}

class SearchForm extends React.Component<Props> {
  public static defaultProps: Props = {
    value: FormSearch.fromJSON({ default: '', engines: []}),
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    const value = this.props.value.toJSON();
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
              onChange={this.bindValue.bind(this)}
              onBlur={this.props.onBlur}
            />
            <input data-index={index} type='text' name='url'
              placeholder='http://example.com/?q={}'
              className='column-url' value={engine[1]}
              onChange={this.bindValue.bind(this)}
              onBlur={this.props.onBlur}
            />
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
      <AddButton name='add' style={{ float: 'right' }}
        onClick={this.bindValue.bind(this)} />
    </div>;
  }

  // eslint-disable-next-line max-statements
  bindValue(e: any) {
    const value = this.props.value.toJSON();
    const name = e.target.name;
    const index = Number(e.target.getAttribute('data-index'));
    const next: typeof value = {
      default: value.default,
      engines: value.engines.slice(),
    };

    if (name === 'name') {
      next.engines[index][0] = e.target.value;
      next.default = value.engines[index][0];
    } else if (name === 'url') {
      next.engines[index][1] = e.target.value;
    } else if (name === 'default') {
      next.default = value.engines[index][0];
    } else if (name === 'add') {
      next.engines.push(['', '']);
    } else if (name === 'delete' && value.engines.length > 1) {
      next.engines.splice(index, 1);
      if (value.engines[index][0] === value.default) {
        const nextIndex = Math.min(index, next.engines.length - 1);
        next.default = next.engines[nextIndex][0];
      }
    }

    this.props.onChange(FormSearch.fromJSON(next));
    if (name === 'delete' || name === 'default') {
      this.props.onBlur();
    }
  }
}

export default SearchForm;
