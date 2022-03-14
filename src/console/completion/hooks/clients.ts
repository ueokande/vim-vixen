import React from "react";
import CompletionClient from "../../clients/CompletionClient";
import CompletionType from "../../../shared/CompletionType";

const completionClient = new CompletionClient();

export const useGetCompletionTypes = (): [
  CompletionType[] | undefined,
  boolean
] => {
  type State = {
    loading: boolean;
    result?: CompletionType[];
  };
  const [state, setState] = React.useState<State>({ loading: true });

  React.useEffect(() => {
    completionClient.getCompletionTypes().then((result) => {
      setState({ loading: false, result });
    });
  }, []);
  return [state.result, state.loading];
};
