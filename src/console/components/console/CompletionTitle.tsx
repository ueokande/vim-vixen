import React from 'react';
import PropTypes from 'prop-types';

const CompletionTitle = (props) => {
  return <li className='vimvixen-console-completion-title'>
    {props.title}
  </li>;
};

CompletionTitle.propTypes = {
  title: PropTypes.string,
};

export default CompletionTitle;
