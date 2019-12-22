import './BlacklistForm.scss';
import AddButton from '../ui/AddButton';
import DeleteButton from '../ui/DeleteButton';
import React from 'react';
import Blacklist, { BlacklistItem } from '../../../shared/settings/Blacklist';

interface Props {
  value: Blacklist;
  onChange: (value: Blacklist) => void;
  onBlur: () => void;
}

class BlacklistForm extends React.Component<Props> {
  public static defaultProps: Props = {
    value: new Blacklist([]),
    onChange: () => {},
    onBlur: () => {},
  };

  render() {
    return <div className='form-blacklist-form'>
      {
        this.props.value.items.map((item, index) => {
          if (item.partial) {
            return null;
          }
          return <div key={index} className='form-blacklist-form-row'>
            <input data-index={index} type='text' name='url'
              className='column-url' value={item.pattern}
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
    const name = e.target.name;
    const index = e.target.getAttribute('data-index');
    const items = this.props.value.items;

    if (name === 'url') {
      items[index] = new BlacklistItem(e.target.value, false, []);
    } else if (name === 'add') {
      items.push(new BlacklistItem('', false, []));
    } else if (name === 'delete') {
      items.splice(index, 1);
    }

    this.props.onChange(new Blacklist(items));
    if (name === 'delete') {
      this.props.onBlur();
    }
  }
}

export default BlacklistForm;
