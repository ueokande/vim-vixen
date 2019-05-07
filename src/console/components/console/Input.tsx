import React from 'react';

interface Props {
  mode: string;
  value: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

class Input extends React.Component<Props> {
  private input: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);

    this.input = React.createRef();
  }

  focus() {
    if (this.input.current) {
      this.input.current.focus();
    }
  }

  render() {
    let prompt = '';
    if (this.props.mode === 'command') {
      prompt = ':';
    } else if (this.props.mode === 'find') {
      prompt = '/';
    }

    return (
      <div className='vimvixen-console-command'>
        <i className='vimvixen-console-command-prompt'>
          { prompt }
        </i>
        <input
          className='vimvixen-console-command-input'
          ref={this.input}
          onBlur={this.props.onBlur}
          onKeyDown={this.props.onKeyDown}
          onChange={this.props.onChange}
          value={this.props.value}
        />
      </div>
    );
  }
}

export default Input;
