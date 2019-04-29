import React from 'react';

export default class InputComponent extends React.Component {
  focus() {
    this.input.focus();
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
          onInput={this.props.onInput}
          value={this.props.value}
        />
      </div>
    );
  }
}
