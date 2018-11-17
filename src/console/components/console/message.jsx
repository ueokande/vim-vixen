import { h } from 'preact';

export default function Message(props) {
  switch (props.mode) {
  case 'error':
    return (
      <p className='vimvixen-console-message vimvixen-console-error'>
        { props.text }
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
