import './console.scss';
import messages from 'shared/messages';
import { connect } from 'preact-redux';
import { h, Component } from 'preact';
import * as consoleActions from 'console/actions/console';

const CompletionTitle = (props) => {
  return <li className='vimvixen-console-completion-title' >{props.name}</li>;
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

class ConsoleComponent extends Component {
  componentDidMount() {
    browser.runtime.onMessage.addListener(this.onMessage.bind(this));
  }

  componentDidUpdate() {
    switch (this.props.mode) {
    case 'command':
    case 'find':
      this.input.focus();
    }
  }

  render() {
    switch (this.props.mode) {
    case 'command':
    case 'find':
      return this.renderInput();
    case 'info':
    case 'error':
      return this.renderMessage();
    }
    return <div className='vimvixen-console'></div>;
  }

  renderInput() {
    let clsName = 'vimvixen-console-command-prompt';
    if (this.props.mode === 'command') {
      clsName += ' prompt-command';
    } else if (this.props.mode === 'find') {
      clsName += ' prompt-find';
    }

    return (
      <div className='vimvixen-console'>
        <div className='vimvixen-console-command-wrapper'>
          { this.renderCompletions() }
          <div className='vimvixen-console-command'>
            <i className={clsName} />
            <input
              ref={(c) => { this.input = c; }}
              className='vimvixen-console-command-input' />
          </div>
        </div>
      </div>
    );
  }

  renderMessage() {
    let clsName = 'vimvixen-console-message';
    if (this.props.mode === 'error') {
      clsName += ' vimvixen-console-error';
    } else if (this.props.mode === 'info') {
      clsName += ' vimvixen-console-info';
    }
    return (
      <div className='vimvixen-console'>
        <p className={clsName}>{ this.props.messageText }</p>
      </div>
    );
  }

  renderCompletions() {
    let rows = [];
    let groups = this.props.completions;
    for (let i = 0; i < groups.length; ++i) {
      let group = groups[i];
      rows.push(<CompletionTitle key={i} name={group.name} />);

      for (let j = 0; j < group.items.length; ++j) {
        let item = group.items[j];
        let highlight = this.props.groupSelection === i &&
          this.props.itemSelection === j;
        rows.push(<CompletionItem
          key={i + '-' + j}
          icon={item.icon}
          caption={item.caption}
          url={item.url}
        />);
      }
    }
    return (
      <ul className='vimvixen-console-completion'>
        {rows}
      </ul>
    );
  }

  onMessage(message) {
    let dispatch = this.context.store.dispatch;
    switch (message.type) {
    case messages.CONSOLE_SHOW_COMMAND:
      return dispatch(consoleActions.showCommand(message.command));
    case messages.CONSOLE_SHOW_FIND:
      return dispatch(consoleActions.showFind());
    case messages.CONSOLE_SHOW_ERROR:
      return dispatch(consoleActions.showError(message.text));
    case messages.CONSOLE_SHOW_INFO:
      return dispatch(consoleActions.showInfo(message.text));
    case messages.CONSOLE_HIDE:
      return dispatch(consoleActions.hide());
    }
  }
}

const mapStateToProps = state => state.console;

export default connect(mapStateToProps)(ConsoleComponent);
