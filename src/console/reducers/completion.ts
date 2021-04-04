import Completions from "../Completions";
import CompletionType from "../../shared/CompletionType";
import {
  COMPLETION_COMPLETION_NEXT,
  COMPLETION_COMPLETION_PREV,
  COMPLETION_SET_COMPLETIONS,
  COMPLETION_START_COMPLETION,
  CompletionAction,
} from "../actions/completion";

export interface State {
  completionTypes: CompletionType[];
  completionSource: string;
  completions: Completions;
  select: number;
}

export const defaultState = {
  completionTypes: [],
  completionSource: "",
  completions: [],
  select: -1,
};

const nextSelection = (state: State): number => {
  if (state.completions.length === 0) {
    return -1;
  }
  if (state.select < 0) {
    return 0;
  }

  const length = state.completions
    .map((g) => g.items.length)
    .reduce((x, y) => x + y);
  if (state.select + 1 < length) {
    return state.select + 1;
  }
  return -1;
};

const prevSelection = (state: State): number => {
  const length = state.completions
    .map((g) => g.items.length)
    .reduce((x, y) => x + y);
  if (state.select < 0) {
    return length - 1;
  }
  return state.select - 1;
};

export const completedText = (state: State): string => {
  if (state.select < 0) {
    return state.completionSource;
  }
  const items = state.completions
    .map((g) => g.items)
    .reduce((g1, g2) => g1.concat(g2));
  return items[state.select].content || "";
};

// eslint-disable-next-line max-lines-per-function
export default function reducer(
  state: State = defaultState,
  action: CompletionAction
): State {
  switch (action.type) {
    case COMPLETION_START_COMPLETION:
      return {
        ...state,
        completionTypes: action.completionTypes,
        completions: [],
        select: -1,
      };
    case COMPLETION_SET_COMPLETIONS:
      return {
        ...state,
        completions: action.completions,
        completionSource: action.completionSource,
        select: -1,
      };
    case COMPLETION_COMPLETION_NEXT: {
      const select = nextSelection(state);
      return {
        ...state,
        select: select,
      };
    }
    case COMPLETION_COMPLETION_PREV: {
      const select = prevSelection(state);
      return {
        ...state,
        select: select,
      };
    }
    default:
      return state;
  }
}
