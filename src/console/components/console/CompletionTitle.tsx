import React from 'react';

interface Props {
  title: string;
}

const CompletionTitle = (props: Props) => {
  return <li className='vimvixen-console-completion-title'>
    {props.title}
  </li>;
};

export default CompletionTitle;
