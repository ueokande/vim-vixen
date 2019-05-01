import React from 'react';

interface Props {
  mode: string;
  value: string;
  onBlur: (e: React.FocusEvent<Element>) => void;
  onKeyDown: (e: React.KeyboardEvent<Element>) => void;
  onChange: (e: React.ChangeEvent<Element>) => void;
}

class Input extends React.Component<Props> {
  private input: HTMLInputElement | null;

  constructor(props: Props) {
    super(props);

    this.input = null;
  }

  focus() {
    if (this.input) {
      this.input.focus();
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
          ref={(c) => { this.input = c; }}
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
