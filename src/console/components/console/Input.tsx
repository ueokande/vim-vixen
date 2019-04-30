import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
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
          onChange={this.props.onChange}
          value={this.props.value}
        />
      </div>
    );
  }
}

Input.propTypes = {
  mode: PropTypes.string,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onChange: PropTypes.func,
};

export default Input;
