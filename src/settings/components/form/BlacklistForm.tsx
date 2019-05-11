import './BlacklistForm.scss';
import AddButton from '../ui/AddButton';
import DeleteButton from '../ui/DeleteButton';
import React from 'react';

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
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
        this.props.value.map((url, index) => {
          return <div key={index} className='form-blacklist-form-row'>
            <input data-index={index} type='text' name='url'
              className='column-url' value={url}
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
    let next = this.props.value ? this.props.value.slice() : [];

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
