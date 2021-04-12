import React from "react";
import { State, defaultState } from "./reducer";
import { CompletionAction } from "./actions";

export const CompletionStateContext = React.createContext<State>(defaultState);

export const CompletionDispatchContext = React.createContext<
  (action: CompletionAction) => void
>(() => {});
