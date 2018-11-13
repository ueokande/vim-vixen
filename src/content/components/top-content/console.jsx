import './console.scss';
import messages from 'shared/messages';
import { connect } from 'preact-redux';
import { h, Component } from 'preact';
import * as consoleActions from '../../actions/console';

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

  onBlur() {
    return this.context.store.dispatch(consoleActions.hideCommand());
  }

  onKeyDown(e) {
    if (e.keyCode === KeyboardEvent.DOM_VK_ESCAPE && e.ctrlKey) {
      this.context.store.dispatch(consoleActions.hideCommand());
    }
    switch (e.keyCode) {
    case KeyboardEvent.DOM_VK_ESCAPE:
      return this.context.store.dispatch(consoleActions.hideCommand());
    case KeyboardEvent.DOM_VK_RETURN:
      return this.doEnter(e);
    case KeyboardEvent.DOM_VK_TAB:
      if (e.shiftKey) {
        this.context.store.dispatch(consoleActions.completionPrev());
      } else {
        this.context.store.dispatch(consoleActions.completionNext());
      }
      e.stopPropagation();
      e.preventDefault();
      break;
    case KeyboardEvent.DOM_VK_OPEN_BRACKET:
      if (e.ctrlKey) {
        return this.context.store.dispatch(consoleActions.hideCommand());
      }
      break;
    case KeyboardEvent.DOM_VK_M:
      if (e.ctrlKey) {
        return this.doEnter(e);
      }
      break;
    case KeyboardEvent.DOM_VK_N:
      if (e.ctrlKey) {
        this.context.store.dispatch(consoleActions.completionNext());
        e.stopPropagation();
        e.preventDefault();
      }
      break;
    case KeyboardEvent.DOM_VK_P:
      if (e.ctrlKey) {
        this.context.store.dispatch(consoleActions.completionPrev());
        e.stopPropagation();
        e.preventDefault();
      }
      break;
    }
  }

  onInput(e) {
    let text = e.target.value;
    if (this.props.mode === 'command') {
      this.context.store.dispatch(consoleActions.setConsoleText(text));
      this.context.store.dispatch(consoleActions.getCompletions(text));
    }
  }

  doEnter(e) {
    e.stopPropagation();
    e.preventDefault();

    let value = e.target.value;
    if (this.props.mode === 'command') {
      return this.context.store.dispatch(consoleActions.enterCommand(value));
    } else if (this.props.mode === 'find') {
      return this.context.store.dispatch(consoleActions.enterFind(value));
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mode !== 'command' && this.props.mode === 'command') {
      this.context.store.dispatch(
        consoleActions.getCompletions(this.props.consoleText));
      this.input.focus();
    } else if (prevProps.mode !== 'find' && this.props.mode === 'find') {
      this.input.focus();
    }
  }

  render() {
    let inner = null;
    switch (this.props.mode) {
    case 'command':
    case 'find':
      inner = this.renderInput();
      break;
    case 'info':
    case 'error':
      inner = this.renderMessage();
      break;
    }
    return (
      <div lang='en' className='vimvixen-console'>
        { inner }
      </div>
    );
  }

  renderInput() {
    let clsName = 'vimvixen-console-command-prompt';
    if (this.props.mode === 'command') {
      clsName += ' prompt-command';
    } else if (this.props.mode === 'find') {
      clsName += ' prompt-find';
    }

    return (
      <div className='vimvixen-console-command-wrapper'>
        { this.renderCompletions() }
        <div className='vimvixen-console-command'>
          <i className={clsName} />
          <input
            ref={(c) => { this.input = c; }}
            className='vimvixen-console-command-input'
            onBlur={this.onBlur.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
            onInput={this.onInput.bind(this)}
            value={this.props.consoleText}
          />
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
      <p className={clsName}>{ this.props.messageText }</p>
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
          highlight={highlight}
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
