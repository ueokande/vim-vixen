import Completions from "../Completions";

export const SET_COMPLETION_SOURCE = "set.completion.source";
export const SET_COMPLETIONS = "set.completions";
export const COMPLETION_NEXT = "completion.next";
export const COMPLETION_PREV = "completion.prev";

export interface SetCompletionSourceAction {
  type: typeof SET_COMPLETION_SOURCE;
  completionSource: string;
}

export interface SetCompletionsAction {
  type: typeof SET_COMPLETIONS;
  completions: Completions;
}

export interface CompletionNextAction {
  type: typeof COMPLETION_NEXT;
}

export interface CompletionPrevAction {
  type: typeof COMPLETION_PREV;
}

export type CompletionAction =
  | SetCompletionSourceAction
  | SetCompletionsAction
  | CompletionNextAction
  | CompletionPrevAction;

export const setCompletionSource = (
  query: string
): SetCompletionSourceAction => {
  return {
    type: SET_COMPLETION_SOURCE,
    completionSource: query,
  };
};

export const setCompletions = (
  completions: Completions
): SetCompletionsAction => {
  return {
    type: SET_COMPLETIONS,
    completions,
  };
};

export const selectNext = (): CompletionNextAction => {
  return {
    type: COMPLETION_NEXT,
  };
};

export const selectPrev = (): CompletionPrevAction => {
  return {
    type: COMPLETION_PREV,
  };
};
