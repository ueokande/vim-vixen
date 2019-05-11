import './console.scss';
import { connect } from 'react-redux';
import React from 'react';
import Input from './console/Input';
import Completion from './console/Completion';
import Message from './console/Message';
import * as consoleActions from '../../console/actions/console';
import { State as AppState } from '../reducers';

const COMPLETION_MAX_ITEMS = 33;

type StateProps = ReturnType<typeof mapStateToProps>;
interface DispatchProps {
  dispatch: (action: any) => void,
}
type Props = StateProps & DispatchProps

class Console extends React.Component<Props> {
  private input: React.RefObject<Input>;

  constructor(props: Props) {
    super(props);

    this.input = React.createRef();
  }

  onBlur() {
    if (this.props.mode === 'command' || this.props.mode === 'find') {
      return this.props.dispatch(consoleActions.hideCommand());
    }
  }

  doEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();
    e.preventDefault();

    let value = (e.target as HTMLInputElement).value;
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
    switch (e.key) {
    case 'Escape':
      return this.props.dispatch(consoleActions.hideCommand());
    case 'Enter':
      return this.doEnter(e);
    case 'Tab':
      if (e.shiftKey) {
        this.props.dispatch(consoleActions.completionPrev());
      } else {
        this.props.dispatch(consoleActions.completionNext());
      }
      e.stopPropagation();
      e.preventDefault();
      break;
    case '[':
      if (e.ctrlKey) {
        return this.props.dispatch(consoleActions.hideCommand());
      }
      break;
    case 'm':
      if (e.ctrlKey) {
        return this.doEnter(e);
      }
      break;
    case 'n':
      if (e.ctrlKey) {
        this.selectNext(e);
      }
      break;
    case 'p':
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
          ref={this.input}
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
    if (this.input.current) {
      this.input.current.focus();
    }
  }
}

const mapStateToProps = (state: AppState) => ({ ...state });

export default connect(
  mapStateToProps,
)(Console);
