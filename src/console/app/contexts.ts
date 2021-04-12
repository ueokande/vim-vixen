import React from "react";
import { State, defaultState } from "./recuer";
import { AppAction } from "./actions";

export const AppStateContext = React.createContext<State>(defaultState);

export const AppDispatchContext = React.createContext<
  (action: AppAction) => void
>(() => {});
