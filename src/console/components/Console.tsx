import React from "react";
import FindPrompt from "./FindPrompt";
import CommandPrompt from "./CommandPrompt";
import InfoMessage from "./InfoMessage";
import ErrorMessage from "./ErrorMessage";
import AppContext from "./AppContext";
import { useColorSchemeRefresh } from "../colorscheme/hooks";

const Console: React.FC = () => {
  const { state } = React.useContext(AppContext);
  const refreshColorScheme = useColorSchemeRefresh();

  React.useEffect(() => {
    if (state.mode !== "") {
      refreshColorScheme();
    }
  }, [state.mode]);

  switch (state.mode) {
    case "command":
      return <CommandPrompt initialInputValue={state.consoleText} />;
    case "find":
      return <FindPrompt />;
    case "info":
      return <InfoMessage>{state.messageText}</InfoMessage>;
    case "error":
      return <ErrorMessage>{state.messageText}</ErrorMessage>;
    default:
      return null;
  }
};

export default Console;
