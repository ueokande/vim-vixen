import React from 'react';
import PropTypes from 'prop-types';
import CompletionItem from './CompletionItem';
import CompletionTitle from './CompletionTitle';

class Completion extends React.Component {
  constructor() {
    super();
    this.state = { viewOffset: 0, select: -1 };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.select === nextProps.select) {
      return null;
    }

    let viewSelect = (() => {
      let index = 0;
      for (let i = 0; i < nextProps.completions.length; ++i) {
        ++index;
        let g = nextProps.completions[i];
        if (nextProps.select + i + 1 < index + g.items.length) {
          return nextProps.select + i + 1;
        }
        index += g.items.length;
      }
    })();

    let viewOffset = 0;
    if (nextProps.select < 0) {
      viewOffset = 0;
    } else if (prevState.select < nextProps.select) {
      viewOffset = Math.max(prevState.viewOffset,
        viewSelect - nextProps.size + 1);
    } else if (prevState.select > nextProps.select) {
      viewOffset = Math.min(prevState.viewOffset, viewSelect);
    }
    return { viewOffset, select: nextProps.select };
  }

  render() {
    let eles = [];
    let index = 0;

    for (let group of this.props.completions) {
      eles.push(<CompletionTitle
        key={`group-${index}`}
        title={ group.name }
      />);
      for (let item of group.items) {
        eles.push(<CompletionItem
          key={`item-${index}`}
          icon={item.icon}
          caption={item.caption}
          url={item.url}
          highlight={index === this.props.select}
        / >);
        ++index;
      }
    }

    let viewOffset = this.state.viewOffset;
    eles = eles.slice(viewOffset, viewOffset + this.props.size);

    return (
      <ul className='vimvixen-console-completion'>
        { eles }
      </ul>
    );
  }
}

Completion.propTypes = {
  select: PropTypes.number,
  size: PropTypes.number,
  completions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string,
      caption: PropTypes.string,
      url: PropTypes.string,
    })),
  })),
};

export default Completion;
