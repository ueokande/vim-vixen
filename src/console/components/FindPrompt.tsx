import React from "react";
import Input from "./console/Input";
import styled from "styled-components";
import useAutoResize from "../hooks/useAutoResize";
import { useExecFind, useHide } from "../app/hooks";

const ConsoleWrapper = styled.div`
  border-top: 1px solid gray;
`;

const FindPrompt: React.FC = () => {
  const [inputValue, setInputValue] = React.useState("");
  const hide = useHide();
  const execFind = useExecFind();

  const onBlur = () => {
    hide();
  };

  useAutoResize();

  const doEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const value = (e.target as HTMLInputElement).value;
    execFind(value === "" ? undefined : value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Escape":
        hide();
        break;
      case "Enter":
        doEnter(e);
        break;
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <ConsoleWrapper>
      <Input
        prompt={"/"}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={onChange}
        value={inputValue}
      />
    </ConsoleWrapper>
  );
};

export default FindPrompt;
