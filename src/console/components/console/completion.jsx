import { Component, h } from 'preact';
import { connect } from 'preact-redux';

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
  render() {
    let eles = [];
    for (let i = 0; i < this.props.completions.length; ++i) {
      let group = this.props.completions[i];
      eles.push(<CompletionTitle title={ group.name }/>);
      for (let j = 0; j < group.items.length; ++j) {
        let item = group.items[j];
        let selected =
          i === this.props.groupSelection &&
          j === this.props.itemSelection;
        eles.push(<CompletionItem
          icon={item.icon}
          caption={item.caption}
          url={item.url}
          highlight={selected}
        / >);
      }
    }

    return (
      <ul className='vimvixen-console-completion'>
        { eles }
      </ul>
    );
  }
}

const mapStateToProps = state => state;
export default connect(mapStateToProps)(CompletionComponent);
