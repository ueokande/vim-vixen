import reducer, { defaultState } from "./reducer";
import React from "react";
import { CompletionDispatchContext, CompletionStateContext } from "./context";

interface Props {
  initialInputValue: string;
}

export const CompletionProvider: React.FC<Props> = ({
  initialInputValue,
  children,
}) => {
  const initialState = {
    ...defaultState,
    completionSource: initialInputValue,
  };
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <CompletionStateContext.Provider value={state}>
      <CompletionDispatchContext.Provider value={dispatch}>
        {children}
      </CompletionDispatchContext.Provider>
    </CompletionStateContext.Provider>
  );
};
