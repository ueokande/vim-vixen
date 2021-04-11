import React from "react";
import * as consoleActions from "../actions/console";
import AppContext from "./AppContext";
import Completion from "./console/Completion";
import Input from "./console//Input";
import styled from "styled-components";
import { useCompletions, useSelectCompletion } from "../completion/hooks";
import useAutoResize from "../hooks/useAutoResize";
import { CompletionProvider } from "../completion/provider";

const COMPLETION_MAX_ITEMS = 33;

const ConsoleWrapper = styled.div`
  border-top: 1px solid gray;
`;

interface Props {
  initialInputValue: string;
}

const CommandPromptInner: React.FC<Props> = ({ initialInputValue }) => {
  const { dispatch } = React.useContext(AppContext);
  const [inputValue, setInputValue] = React.useState(initialInputValue);
  const { completions, updateCompletions } = useCompletions();
  const {
    select,
    currentValue,
    selectNext,
    selectPrev,
  } = useSelectCompletion();

  useAutoResize();

  const onBlur = () => {
    dispatch(consoleActions.hideCommand());
  };

  const isCancelKey = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) =>
      e.key === "Escape" ||
      (e.ctrlKey && e.key === "[") ||
      (e.ctrlKey && e.key === "c"),
    []
  );

  const isNextKey = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) =>
      (!e.shiftKey && e.key === "Tab") || (e.ctrlKey && e.key === "n"),
    []
  );

  const isPrevKey = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) =>
      (e.shiftKey && e.key === "Tab") || (e.ctrlKey && e.key === "p"),
    []
  );

  const isEnterKey = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) =>
      e.key === "Enter" || (e.ctrlKey && e.key === "m"),
    []
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCancelKey(e)) {
      dispatch(consoleActions.hideCommand());
    } else if (isEnterKey(e)) {
      const value = (e.target as HTMLInputElement).value;
      dispatch(consoleActions.enterCommand(value));
    } else if (isNextKey(e)) {
      selectNext();
    } else if (isPrevKey(e)) {
      selectPrev();
    } else {
      return;
    }

    e.stopPropagation();
    e.preventDefault();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
  };

  React.useEffect(() => {
    updateCompletions(inputValue);
  }, [inputValue]);

  return (
    <ConsoleWrapper>
      <Completion
        size={COMPLETION_MAX_ITEMS}
        completions={completions}
        select={select}
      />
      <Input
        prompt={":"}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={onChange}
        value={select == -1 ? inputValue : currentValue}
      />
    </ConsoleWrapper>
  );
};

const CommandPrompt: React.FC<Props> = ({ initialInputValue }) => (
  <CompletionProvider initialInputValue={initialInputValue}>
    <CommandPromptInner initialInputValue={initialInputValue} />
  </CompletionProvider>
);

export default CommandPrompt;
