import './console.scss';
import { connect } from 'react-redux';
import React from 'react';
import Input from './console/Input';
import Completion from './console/Completion';
import Message from './console/Message';
import * as consoleActions from '../../console/actions/console';

const COMPLETION_MAX_ITEMS = 33;

interface Props {
  mode?: string;
  consoleText?: string;
  messageText?: string;
  children?: string;
}

class Console extends React.Component<Props> {
  private input: HTMLInputElement | null;

  constructor(props: Props) {
    super(props);

    this.input = null;
  }

  onBlur() {
    if (this.props.mode === 'command' || this.props.mode === 'find') {
      return this.props.dispatch(consoleActions.hideCommand());
    }
  }

  doEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();
    e.preventDefault();

    let value = e.target.value;
    if (this.props.mode === 'command') {
      return this.props.dispatch(consoleActions.enterCommand(value));
    } else if (this.props.mode === 'find') {
      return this.props.dispatch(consoleActions.enterFind(value));
    }
  }

  selectNext(e: React.KeyboardEvent<HTMLInputElement>) {
    this.props.dispatch(consoleActions.completionNext());
    e.stopPropagation();
    e.preventDefault();
  }

  selectPrev(e: React.KeyboardEvent<HTMLInputElement>) {
    this.props.dispatch(consoleActions.completionPrev());
    e.stopPropagation();
    e.preventDefault();
  }

  onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === KeyboardEvent.DOM_VK_ESCAPE && e.ctrlKey) {
      this.props.dispatch(consoleActions.hideCommand());
    }
    switch (e.keyCode) {
    case KeyboardEvent.DOM_VK_ESCAPE:
      return this.props.dispatch(consoleActions.hideCommand());
    case KeyboardEvent.DOM_VK_RETURN:
      return this.doEnter(e);
    case KeyboardEvent.DOM_VK_TAB:
      if (e.shiftKey) {
        this.props.dispatch(consoleActions.completionPrev());
      } else {
        this.props.dispatch(consoleActions.completionNext());
      }
      e.stopPropagation();
      e.preventDefault();
      break;
    case KeyboardEvent.DOM_VK_OPEN_BRACKET:
      if (e.ctrlKey) {
        return this.props.dispatch(consoleActions.hideCommand());
      }
      break;
    case KeyboardEvent.DOM_VK_M:
      if (e.ctrlKey) {
        return this.doEnter(e);
      }
      break;
    case KeyboardEvent.DOM_VK_N:
      if (e.ctrlKey) {
        this.selectNext(e);
      }
      break;
    case KeyboardEvent.DOM_VK_P:
      if (e.ctrlKey) {
        this.selectPrev(e);
      }
      break;
    }
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    let text = e.target.value;
    this.props.dispatch(consoleActions.setConsoleText(text));
    if (this.props.mode === 'command') {
      this.props.dispatch(consoleActions.getCompletions(text));
    }
  }


  componentDidUpdate(prevProps: Props) {
    if (!this.input) {
      return;
    }
    if (prevProps.mode !== 'command' && this.props.mode === 'command') {
      this.props.dispatch(
        consoleActions.getCompletions(this.props.consoleText));
      this.focus();
    } else if (prevProps.mode !== 'find' && this.props.mode === 'find') {
      this.focus();
    }
  }

  render() {
    switch (this.props.mode) {
    case 'command':
    case 'find':
      return <div className='vimvixen-console-command-wrapper'>
        <Completion
          size={COMPLETION_MAX_ITEMS}
          completions={this.props.completions}
          select={this.props.select}
        />
        <Input
          ref={(c) => { this.input = c; }}
          mode={this.props.mode}
          onBlur={this.onBlur.bind(this)}
          onKeyDown={this.onKeyDown.bind(this)}
          onChange={this.onChange.bind(this)}
          value={this.props.consoleText}
        />
      </div>;
    case 'info':
    case 'error':
      return <Message mode={ this.props.mode } >
        { this.props.messageText }
      </Message>;
    default:
      return null;
    }
  }

  focus() {
    window.focus();
    if (this.input) {
      this.input.focus();
    }
  }
}

const mapStateToProps = (state: any) => state;
export default connect(mapStateToProps)(Console);
