import React from 'react';
import PropTypes from 'prop-types';

const Message = (props) => {
  switch (props.mode) {
  case 'error':
    return (
      <p className='vimvixen-console-message vimvixen-console-error'>
        { props.children }
      </p>
    );
  case 'info':
    return (
      <p className='vimvixen-console-message vimvixen-console-info'>
        { props.children }
      </p>
    );
  }
};

Message.propTypes = {
  children: PropTypes.string,
};

export default Message;
