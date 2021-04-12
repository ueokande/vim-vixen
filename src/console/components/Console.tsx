import React from "react";
import FindPrompt from "./FindPrompt";
import CommandPrompt from "./CommandPrompt";
import InfoMessage from "./InfoMessage";
import ErrorMessage from "./ErrorMessage";
import { useColorSchemeRefresh } from "../colorscheme/hooks";
import {
  useCommandMode,
  useErrorMessage,
  useFindMode,
  useInfoMessage,
} from "../app/hooks";

const Console: React.FC = () => {
  const refreshColorScheme = useColorSchemeRefresh();
  const { visible: visibleCommand, initialInputValue } = useCommandMode();
  const { visible: visibleFind } = useFindMode();
  const { visible: visibleInfo, message: infoMessage } = useInfoMessage();
  const { visible: visibleError, message: errorMessage } = useErrorMessage();

  React.useEffect(() => {
    if (visibleCommand || visibleFind || visibleInfo || visibleError) {
      refreshColorScheme();
    }
  }, [visibleCommand, visibleFind, visibleInfo, visibleError]);

  if (visibleCommand) {
    return <CommandPrompt initialInputValue={initialInputValue} />;
  } else if (visibleFind) {
    return <FindPrompt />;
  } else if (visibleInfo) {
    return <InfoMessage>{infoMessage}</InfoMessage>;
  } else if (visibleError) {
    return <ErrorMessage>{errorMessage}</ErrorMessage>;
  }
  return null;
};

export default Console;
