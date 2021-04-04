import React from "react";
import * as consoleActions from "../../console/actions/console";
import AppContext from "./AppContext";
import Input from "./console/Input";
import styled from "styled-components";
import useAutoResize from "../hooks/useAutoResize";

const ConsoleWrapper = styled.div`
  border-top: 1px solid gray;
`;

const FindPrompt: React.FC = () => {
  const { dispatch } = React.useContext(AppContext);
  const [inputValue, setInputValue] = React.useState("");

  const onBlur = () => {
    dispatch(consoleActions.hideCommand());
  };

  useAutoResize();

  const doEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const value = (e.target as HTMLInputElement).value;
    dispatch(consoleActions.enterFind(value === "" ? undefined : value));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Escape":
        dispatch(consoleActions.hideCommand());
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
