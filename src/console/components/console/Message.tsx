import React from 'react';

interface Props {
  mode: string;
  children: string;
}

const Message = (props: Props) => {
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
  return null;
};

export default Message;
