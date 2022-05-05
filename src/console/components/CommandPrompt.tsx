import React from "react";
import Completion from "./console/Completion";
import Input from "./console//Input";
import styled from "styled-components";
import { useCompletions, useSelectCompletion } from "../completion/hooks";
import useDebounce from "../hooks/useDebounce";
import useAutoResize from "../hooks/useAutoResize";
import { CompletionProvider } from "../completion/provider";
import { useExecCommand, useHide } from "../app/hooks";

const COMPLETION_MAX_ITEMS = 33;

const ConsoleWrapper = styled.div`
  border-top: 1px solid gray;
`;

interface Props {
  initialInputValue: string;
}

enum SelectQueueType {
  SelectNext,
  SelectPrev,
}

const CommandPromptInner: React.FC<Props> = ({ initialInputValue }) => {
  const hide = useHide();
  const [inputValue, setInputValue] = React.useState(initialInputValue);
  const debouncedValue = useDebounce(inputValue, 100);
  const { completions, loading } = useCompletions(debouncedValue);
  const { select, currentValue, selectNext, selectPrev } =
    useSelectCompletion();
  const execCommand = useExecCommand();

  // The value is set after the user presses Tab (or Shift+Tab) key and waiting the completion
  const [selecting, setSelecting] = React.useState<SelectQueueType>();

  useAutoResize();

  const onBlur = () => {
    hide();
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
      hide();
    } else if (isEnterKey(e)) {
      const value = (e.target as HTMLInputElement).value;
      execCommand(value);
      hide();
    } else if (isNextKey(e)) {
      setSelecting(SelectQueueType.SelectNext);
    } else if (isPrevKey(e)) {
      setSelecting(SelectQueueType.SelectPrev);
    } else {
      return;
    }

    e.stopPropagation();
    e.preventDefault();
  };

  React.useEffect(() => {
    if (inputValue !== debouncedValue || loading) {
      // The completions of the latest input value are not fetched
      return;
    }
    if (selecting === SelectQueueType.SelectNext) {
      selectNext();
      setSelecting(undefined);
    } else if (selecting === SelectQueueType.SelectPrev) {
      selectPrev();
      setSelecting(undefined);
    }
  }, [inputValue, debouncedValue, selecting, loading]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
  };

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
        value={select == -1 || loading ? inputValue : currentValue}
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
