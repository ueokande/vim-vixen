import React from 'react';

export default function Message(props) {
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
}
