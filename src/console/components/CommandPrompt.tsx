import React from "react";
import * as consoleActions from "../actions/console";
import * as completionActions from "../actions/completion";
import AppContext from "./AppContext";
import CommandLineParser, {
  InputPhase,
} from "../commandline/CommandLineParser";
import Completion from "./console/Completion";
import ConsoleFrameClient from "../clients/ConsoleFrameClient";
import Input from "./console//Input";
import { Command } from "../../shared/Command";
import styled from "styled-components";
import reducer, { defaultState, completedText } from "../reducers/completion";
import CompletionType from "../../shared/CompletionType";

const COMPLETION_MAX_ITEMS = 33;

const ConsoleWrapper = styled.div`
  border-top: 1px solid gray;
`;

const CommandPrompt: React.FC = () => {
  const { state, dispatch } = React.useContext(AppContext);
  const [completionState, completionDispatch] = React.useReducer(
    reducer,
    defaultState
  );
  const commandLineParser = new CommandLineParser();
  const consoleFrameClient = new ConsoleFrameClient();

  const onBlur = () => {
    dispatch(consoleActions.hideCommand());
  };

  const doEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const value = (e.target as HTMLInputElement).value;
    dispatch(consoleActions.enterCommand(value));
  };

  const selectNext = (e: React.KeyboardEvent<HTMLInputElement>) => {
    completionDispatch(completionActions.completionNext());
    e.stopPropagation();
    e.preventDefault();
  };

  const selectPrev = (e: React.KeyboardEvent<HTMLInputElement>) => {
    completionDispatch(completionActions.completionPrev());
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
          completionDispatch(completionActions.completionPrev());
        } else {
          completionDispatch(completionActions.completionNext());
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
    const action = getCompletionAction(text);
    Promise.resolve(action).then((a) => {
      if (a) {
        completionDispatch(a);

        const {
          scrollWidth: width,
          scrollHeight: height,
        } = document.getElementById("vimvixen-console")!;
        consoleFrameClient.resize(width, height);
      }
    });
  };

  React.useEffect(() => {
    completionActions.startCompletion().then((action) => {
      completionDispatch(action);

      const completionAction = getCompletionAction(
        state.consoleText,
        action.completionTypes
      );
      Promise.resolve(completionAction).then((a) => {
        if (a) {
          completionDispatch(a);

          const {
            scrollWidth: width,
            scrollHeight: height,
          } = document.getElementById("vimvixen-console")!;
          consoleFrameClient.resize(width, height);
        }
      });
    });
  }, []);

  const getCompletionAction = (
    text: string,
    completionTypes: CompletionType[] | undefined = undefined
  ) => {
    const types = completionTypes || completionState.completionTypes;
    const phase = commandLineParser.inputPhase(text);
    if (phase === InputPhase.OnCommand) {
      return completionActions.getCommandCompletions(text);
    } else {
      const cmd = commandLineParser.parse(text);
      switch (cmd.command) {
        case Command.Open:
        case Command.TabOpen:
        case Command.WindowOpen:
          return completionActions.getOpenCompletions(
            types,
            text,
            cmd.command,
            cmd.args
          );
        case Command.Buffer:
          return completionActions.getTabCompletions(
            text,
            cmd.command,
            cmd.args,
            false
          );
        case Command.BufferDelete:
        case Command.BuffersDelete:
          return completionActions.getTabCompletions(
            text,
            cmd.command,
            cmd.args,
            true
          );
        case Command.BufferDeleteForce:
        case Command.BuffersDeleteForce:
          return completionActions.getTabCompletions(
            text,
            cmd.command,
            cmd.args,
            false
          );
        case Command.Set:
          return completionActions.getPropertyCompletions(
            text,
            cmd.command,
            cmd.args
          );
      }
    }
    return undefined;
  };

  return (
    <ConsoleWrapper>
      <Completion
        size={COMPLETION_MAX_ITEMS}
        completions={completionState.completions}
        select={completionState.select}
      />
      <Input
        prompt={":"}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={onChange}
        value={
          completionState.select < 0
            ? state.consoleText
            : completedText(completionState)
        }
      />
    </ConsoleWrapper>
  );
};

export default CommandPrompt;
