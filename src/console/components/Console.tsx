import React from "react";
import FindPrompt from "./FindPrompt";
import CommandPrompt from "./CommandPrompt";
import InfoMessage from "./InfoMessage";
import ErrorMessage from "./ErrorMessage";
import * as consoleActions from "../../console/actions/console";
import ColorSchemeProvider from "./ColorSchemeProvider";
import AppContext from "./AppContext";

const Console: React.FC = () => {
  const { state, dispatch } = React.useContext(AppContext);

  React.useEffect(() => {
    dispatch(consoleActions.setColorScheme());
  }, []);

  const ele = (() => {
    switch (state.mode) {
      case "command":
        return <CommandPrompt />;
      case "find":
        return <FindPrompt />;
      case "info":
        return <InfoMessage>{state.messageText}</InfoMessage>;
      case "error":
        return <ErrorMessage>{state.messageText}</ErrorMessage>;
      default:
        return null;
    }
  })();

  return (
    <ColorSchemeProvider colorscheme={state.colorscheme}>
      {ele}
    </ColorSchemeProvider>
  );
};

export default Console;
