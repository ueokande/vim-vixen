import React from 'react';
import PropTypes from 'prop-types';

class Provider extends React.PureComponent {
  getChildContext() {
    return { store: this.props.store };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

Provider.childContextTypes = {
  store: PropTypes.any,
};

export default Provider;
