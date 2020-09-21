import "./console.scss";
import { connect } from "react-redux";
import React from "react";
import Input from "./console/Input";
import Completion from "./console/Completion";
import Message from "./console/Message";
import * as consoleActions from "../../console/actions/console";
import { State as AppState } from "../reducers";
import CommandLineParser, {
  InputPhase,
} from "../commandline/CommandLineParser";
import { Command } from "../../shared/Command";
import ColorScheme from "../../shared/ColorScheme";
import { LightTheme, DarkTheme } from "./Theme";
import styled from "./Theme";
import { ThemeProvider } from "styled-components";

const ConsoleWrapper = styled.div`
  border-top: 1px solid gray;
`;

const COMPLETION_MAX_ITEMS = 33;

type StateProps = ReturnType<typeof mapStateToProps>;
interface DispatchProps {
  dispatch: (action: any) => void;
}
type Props = StateProps & DispatchProps;

class Console extends React.Component<Props> {
  private input: React.RefObject<Input>;

  private commandLineParser: CommandLineParser = new CommandLineParser();

  constructor(props: Props) {
    super(props);

    this.input = React.createRef();
  }

  onBlur() {
    if (this.props.mode === "command" || this.props.mode === "find") {
      return this.props.dispatch(consoleActions.hideCommand());
    }
  }

  doEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();
    e.preventDefault();

    const value = (e.target as HTMLInputElement).value;
    if (this.props.mode === "command") {
      return this.props.dispatch(consoleActions.enterCommand(value));
    } else if (this.props.mode === "find") {
      return this.props.dispatch(
        consoleActions.enterFind(value === "" ? undefined : value)
      );
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
      case "Escape":
        return this.props.dispatch(consoleActions.hideCommand());
      case "Enter":
        return this.doEnter(e);
      case "Tab":
        if (e.shiftKey) {
          this.props.dispatch(consoleActions.completionPrev());
        } else {
          this.props.dispatch(consoleActions.completionNext());
        }
        e.stopPropagation();
        e.preventDefault();
        break;
      case "[":
        if (e.ctrlKey) {
          e.preventDefault();
          return this.props.dispatch(consoleActions.hideCommand());
        }
        break;
      case "c":
        if (e.ctrlKey) {
          e.preventDefault();
          return this.props.dispatch(consoleActions.hideCommand());
        }
        break;
      case "m":
        if (e.ctrlKey) {
          return this.doEnter(e);
        }
        break;
      case "n":
        if (e.ctrlKey) {
          this.selectNext(e);
        }
        break;
      case "p":
        if (e.ctrlKey) {
          this.selectPrev(e);
        }
        break;
    }
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    this.props.dispatch(consoleActions.setConsoleText(text));
    if (this.props.mode !== "command") {
      return;
    }
    this.updateCompletions(text);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.mode !== "command" && this.props.mode === "command") {
      this.updateCompletions(this.props.consoleText);
      this.focus();
    } else if (prevProps.mode !== "find" && this.props.mode === "find") {
      this.focus();
    }
  }

  render() {
    let theme = this.props.colorscheme;
    if (this.props.colorscheme === ColorScheme.System) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        theme = ColorScheme.Dark;
      } else {
        theme = ColorScheme.Light;
      }
    }

    switch (this.props.mode) {
      case "command":
      case "find":
        return (
          <ThemeProvider
            theme={theme === ColorScheme.Dark ? DarkTheme : LightTheme}
          >
            <ConsoleWrapper>
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
            </ConsoleWrapper>
          </ThemeProvider>
        );
      case "info":
      case "error":
        return (
          <ThemeProvider
            theme={theme === ColorScheme.Dark ? DarkTheme : LightTheme}
          >
            <Message mode={this.props.mode}>{this.props.messageText}</Message>
          </ThemeProvider>
        );
      default:
        return null;
    }
  }

  async focus() {
    this.props.dispatch(consoleActions.setColorScheme());

    window.focus();
    if (this.input.current) {
      this.input.current.focus();
    }
  }

  private updateCompletions(text: string) {
    const phase = this.commandLineParser.inputPhase(text);
    if (phase === InputPhase.OnCommand) {
      return this.props.dispatch(consoleActions.getCommandCompletions(text));
    } else {
      const cmd = this.commandLineParser.parse(text);
      switch (cmd.command) {
        case Command.Open:
        case Command.TabOpen:
        case Command.WindowOpen:
          this.props.dispatch(
            consoleActions.getOpenCompletions(
              this.props.completionTypes,
              text,
              cmd.command,
              cmd.args
            )
          );
          break;
        case Command.Buffer:
          this.props.dispatch(
            consoleActions.getTabCompletions(text, cmd.command, cmd.args, false)
          );
          break;
        case Command.BufferDelete:
        case Command.BuffersDelete:
          this.props.dispatch(
            consoleActions.getTabCompletions(text, cmd.command, cmd.args, true)
          );
          break;
        case Command.BufferDeleteForce:
        case Command.BuffersDeleteForce:
          this.props.dispatch(
            consoleActions.getTabCompletions(text, cmd.command, cmd.args, false)
          );
          break;
        case Command.Set:
          this.props.dispatch(
            consoleActions.getPropertyCompletions(text, cmd.command, cmd.args)
          );
          break;
      }
    }
  }
}

const mapStateToProps = (state: AppState) => ({ ...state });

export default connect(mapStateToProps)(Console);
