import './BlacklistForm.scss';
import AddButton from '../ui/AddButton';
import DeleteButton from '../ui/DeleteButton';
import React from 'react';
import { BlacklistJSON } from '../../../shared/settings/Blacklist';

interface Props {
  value: BlacklistJSON;
  onChange: (value: BlacklistJSON) => void;
  onBlur: () => void;
}

class BlacklistForm extends React.Component<Props> {
  public static defaultProps: Props = {
    value: [],
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    return <div className='form-blacklist-form'>
      {
        this.props.value
          .map((item, index) => {
            if (typeof item !== 'string') {
              // TODO support partial blacklist;
              return null;
            }
            return <div key={index} className='form-blacklist-form-row'>
              <input data-index={index} type='text' name='url'
                className='column-url' value={item}
                onChange={this.bindValue.bind(this)}
                onBlur={this.props.onBlur}
              />
              <DeleteButton data-index={index} name='delete'
                onClick={this.bindValue.bind(this)}
                onBlur={this.props.onBlur}
              />
            </div>;
          })
      }
      <AddButton name='add' style={{ float: 'right' }}
        onClick={this.bindValue.bind(this)} />
    </div>;
  }

  bindValue(e: any) {
    let name = e.target.name;
    let index = e.target.getAttribute('data-index');
    let next = this.props.value.slice();

    if (name === 'url') {
      next[index] = e.target.value;
    } else if (name === 'add') {
      next.push('');
    } else if (name === 'delete') {
      next.splice(index, 1);
    }

    this.props.onChange(next);
    if (name === 'delete') {
      this.props.onBlur();
    }
  }
}

export default BlacklistForm;
