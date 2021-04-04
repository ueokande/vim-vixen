import React from "react";
import { State, defaultState } from "../reducers";
import { ConsoleAction } from "../actions";

const AppContext = React.createContext<{
  state: State;
  dispatch: React.Dispatch<Promise<ConsoleAction> | ConsoleAction>;
}>({
  state: defaultState,
  dispatch: () => null,
});

export default AppContext;
