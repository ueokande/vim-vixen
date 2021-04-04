import React from "react";
import Input from "./console/Input";
import Completion from "./console/Completion";
import InfoMessage from "./InfoMessage";
import ErrorMessage from "./ErrorMessage";
import * as consoleActions from "../../console/actions/console";
import CommandLineParser, {
  InputPhase,
} from "../commandline/CommandLineParser";
import { Command } from "../../shared/Command";
import ColorSchemeProvider, { styled } from "./ColorSchemeProvider";
import ConsoleFrameClient from "../clients/ConsoleFrameClient";
import AppContext from "./AppContext";

const ConsoleWrapper = styled.div`
  border-top: 1px solid gray;
`;

const COMPLETION_MAX_ITEMS = 33;

const Console: React.FC = () => {
  const { state, dispatch } = React.useContext(AppContext);
  const commandLineParser = new CommandLineParser();
  const consoleFrameClient = new ConsoleFrameClient();

  const onBlur = () => {
    if (state.mode === "command" || state.mode === "find") {
      dispatch(consoleActions.hideCommand());
    }
  };

  const doEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const value = (e.target as HTMLInputElement).value;
    if (state.mode === "command") {
      dispatch(consoleActions.enterCommand(value));
    } else if (state.mode === "find") {
      dispatch(consoleActions.enterFind(value === "" ? undefined : value));
    }
  };

  const selectNext = (e: React.KeyboardEvent<HTMLInputElement>) => {
    dispatch(consoleActions.completionNext());
    e.stopPropagation();
    e.preventDefault();
  };

  const selectPrev = (e: React.KeyboardEvent<HTMLInputElement>) => {
    dispatch(consoleActions.completionPrev());
    e.stopPropagation();
    e.preventDefault();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Escape":
        dispatch(consoleActions.hideCommand());
        break;
      case "Enter":
        doEnter(e);
        break;
      case "Tab":
        if (e.shiftKey) {
          dispatch(consoleActions.completionPrev());
        } else {
          dispatch(consoleActions.completionNext());
        }
        e.stopPropagation();
        e.preventDefault();
        break;
      case "[":
        if (e.ctrlKey) {
          e.preventDefault();
          dispatch(consoleActions.hideCommand());
        }
        break;
      case "c":
        if (e.ctrlKey) {
          e.preventDefault();
          dispatch(consoleActions.hideCommand());
        }
        break;
      case "m":
        if (e.ctrlKey) {
          doEnter(e);
        }
        break;
      case "n":
        if (e.ctrlKey) {
          selectNext(e);
        }
        break;
      case "p":
        if (e.ctrlKey) {
          selectPrev(e);
        }
        break;
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    dispatch(consoleActions.setConsoleText(text));
    if (state.mode !== "command") {
      return;
    }
    updateCompletions(text);
  };

  const prevState = React.useRef(state);
  React.useEffect(() => {
    if (prevState.current.mode !== "command" && state.mode === "command") {
      updateCompletions(state.consoleText);
      focus();
    } else if (prevState.current.mode !== "find" && state.mode === "find") {
      focus();
    }

    const {
      scrollWidth: width,
      scrollHeight: height,
    } = document.getElementById("vimvixen-console")!;
    consoleFrameClient.resize(width, height);

    prevState.current = state;
  });

  const focus = () => {
    dispatch(consoleActions.setColorScheme());

    window.focus();
  };

  const updateCompletions = (text: string) => {
    const phase = commandLineParser.inputPhase(text);
    if (phase === InputPhase.OnCommand) {
      dispatch(consoleActions.getCommandCompletions(text));
    } else {
      const cmd = commandLineParser.parse(text);
      switch (cmd.command) {
        case Command.Open:
        case Command.TabOpen:
        case Command.WindowOpen:
          dispatch(
            consoleActions.getOpenCompletions(
              state.completionTypes,
              text,
              cmd.command,
              cmd.args
            )
          );
          break;
        case Command.Buffer:
          dispatch(
            consoleActions.getTabCompletions(text, cmd.command, cmd.args, false)
          );
          break;
        case Command.BufferDelete:
        case Command.BuffersDelete:
          dispatch(
            consoleActions.getTabCompletions(text, cmd.command, cmd.args, true)
          );
          break;
        case Command.BufferDeleteForce:
        case Command.BuffersDeleteForce:
          dispatch(
            consoleActions.getTabCompletions(text, cmd.command, cmd.args, false)
          );
          break;
        case Command.Set:
          dispatch(
            consoleActions.getPropertyCompletions(text, cmd.command, cmd.args)
          );
          break;
      }
    }
  };

  switch (state.mode) {
    case "command":
    case "find":
      return (
        <ColorSchemeProvider colorscheme={state.colorscheme}>
          <ConsoleWrapper>
            <Completion
              size={COMPLETION_MAX_ITEMS}
              completions={state.completions}
              select={state.select}
            />
            <Input
              mode={state.mode}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              onChange={onChange}
              value={state.consoleText}
            />
          </ConsoleWrapper>
        </ColorSchemeProvider>
      );
    case "info":
      return (
        <ColorSchemeProvider colorscheme={state.colorscheme}>
          <InfoMessage>{state.messageText}</InfoMessage>
        </ColorSchemeProvider>
      );
    case "error":
      return (
        <ColorSchemeProvider colorscheme={state.colorscheme}>
          <ErrorMessage>{state.messageText}</ErrorMessage>
        </ColorSchemeProvider>
      );
    default:
      return null;
  }
};

export default Console;
