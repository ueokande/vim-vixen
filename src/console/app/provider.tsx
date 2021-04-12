import React from "react";
import reducer, { defaultState } from "./recuer";
import { AppDispatchContext, AppStateContext } from "./contexts";

export const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, defaultState);
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
