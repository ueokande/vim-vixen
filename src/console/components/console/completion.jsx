import { Component, h } from 'preact';
import { connect } from 'preact-redux';

const COMPLETION_MAX_ITEMS = 33;

const CompletionTitle = (props) => {
  return <li className='vimvixen-console-completion-title' >{props.title}</li>;
};

const CompletionItem = (props) => {
  let className = 'vimvixen-console-completion-item';
  if (props.highlight) {
    className += ' vimvixen-completion-selected';
  }
  return <li
    className={className}
    style={{ backgroundImage: 'url(' + props.icon + ')' }}
  >
    <span
      className='vimvixen-console-completion-item-caption'
    >{props.caption}</span>
    <span
      className='vimvixen-console-completion-item-url'
    >{props.url}</span>
  </li>;
};


class CompletionComponent extends Component {
  constructor() {
    super();
    this.state = { viewOffset: 0, select: -1 };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.select === nextProps.select) {
      return null;
    }

    let viewSelect = (() => {
      let view = 0;
      let index = 0;
      for (let group of nextProps.completions) {
        ++view;
        // TODO refactor
        for (let _ of group.items) {
          if (index === nextProps.select) {
            return view;
          }
          ++view;
          ++index;
        }
      }
    })();

    let viewOffset = 0;
    if (nextProps.select < 0) {
      viewOffset = 0;
    } else if (prevState.select < nextProps.select) {
      viewOffset = Math.max(prevState.viewOffset,
        viewSelect - COMPLETION_MAX_ITEMS + 1);
    } else if (prevState.select > nextProps.select) {
      viewOffset = Math.min(prevState.viewOffset, viewSelect);
    }
    return { viewOffset, select: nextProps.select };
  }

  render() {
    let eles = [];
    let index = 0;

    for (let group of this.props.completions) {
      eles.push(<CompletionTitle title={ group.name }/>);
      for (let item of group.items) {
        eles.push(<CompletionItem
          icon={item.icon}
          caption={item.caption}
          url={item.url}
          highlight={index === this.props.select}
        / >);
        ++index;
      }
    }

    let viewOffset = this.state.viewOffset;
    eles = eles.slice(viewOffset, viewOffset + COMPLETION_MAX_ITEMS);

    return (
      <ul className='vimvixen-console-completion'>
        { eles }
      </ul>
    );
  }
}

const mapStateToProps = state => state;
export default connect(mapStateToProps)(CompletionComponent);
