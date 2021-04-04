import React from "react";
import { State, defaultState } from "../reducers/console";
import { ConsoleAction } from "../actions/console";

const AppContext = React.createContext<{
  state: State;
  dispatch: React.Dispatch<Promise<ConsoleAction> | ConsoleAction>;
}>({
  state: defaultState,
  dispatch: () => null,
});

export default AppContext;
