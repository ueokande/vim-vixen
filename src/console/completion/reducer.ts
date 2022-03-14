import Completions from "../Completions";
import CompletionType from "../../shared/CompletionType";
import {
  SET_COMPLETION_SOURCE,
  SET_COMPLETIONS,
  COMPLETION_NEXT,
  COMPLETION_PREV,
  CompletionAction,
} from "./actions";

export interface State {
  completionTypes?: CompletionType[];
  completionSource: string;
  completions: Completions;
  select: number;
}

export const defaultState = {
  completionTypes: undefined,
  completionSource: "",
  completions: [],
  select: -1,
};

const nextSelection = (state: State): number => {
  const length = state.completions
    .map((g) => g.items.length)
    .reduce((x, y) => x + y, 0);
  if (length === 0) {
    return -1;
  }
  if (state.select < 0) {
    return 0;
  }
  if (state.select + 1 < length) {
    return state.select + 1;
  }
  return -1;
};

const prevSelection = (state: State): number => {
  if (state.completions.length === 0) {
    return -1;
  }
  const length = state.completions
    .map((g) => g.items.length)
    .reduce((x, y) => x + y);
  if (state.select < 0) {
    return length - 1;
  }
  return state.select - 1;
};

// eslint-disable-next-line max-lines-per-function
export default function reducer(
  state: State = defaultState,
  action: CompletionAction
): State {
  switch (action.type) {
    case SET_COMPLETION_SOURCE:
      return {
        ...state,
        completionSource: action.completionSource,
        select: -1,
      };
    case SET_COMPLETIONS:
      return {
        ...state,
        completions: action.completions,
      };
    case COMPLETION_NEXT: {
      const select = nextSelection(state);
      return {
        ...state,
        select: select,
      };
    }
    case COMPLETION_PREV: {
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
