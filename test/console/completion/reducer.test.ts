import reducer, {
  defaultState,
  State,
} from "../../../src/console/completion/reducer";
import { expect } from "chai";
import {
  initCompletion,
  selectNext,
  selectPrev,
  setCompletions,
  setCompletionSource,
} from "../../../src/console/completion/actions";
import CompletionType from "../../../src/shared/CompletionType";

describe("completion reducer", () => {
  describe("initCompletion", () => {
    it("initializes completions", () => {
      const nextState = reducer(
        defaultState,
        initCompletion([CompletionType.Bookmarks, CompletionType.History])
      );

      expect(nextState.completionTypes).deep.equals([
        CompletionType.Bookmarks,
        CompletionType.History,
      ]);
    });
  });

  describe("setCompletionSource", () => {
    it("sets a completion source", () => {
      const nextState = reducer(defaultState, setCompletionSource("open "));

      expect(nextState.completionSource).equals("open ");
    });
  });

  describe("setCompletions", () => {
    it("sets completions", () => {
      const nextState = reducer(
        defaultState,
        setCompletions([
          {
            name: "Apple",
            items: [{}, {}],
          },
          {
            name: "Banana",
            items: [{}],
          },
        ])
      );

      expect(nextState.completions).deep.equals([
        {
          name: "Apple",
          items: [{}, {}],
        },
        {
          name: "Banana",
          items: [{}],
        },
      ]);
    });
  });

  describe("selectNext", () => {
    context("when no completion groups", () => {
      it("does nothing", () => {
        const nextState = reducer(defaultState, selectNext());
        expect(nextState.select).equals(-1);
      });
    });

    context("when no completion items", () => {
      it("does nothing", () => {
        const state = {
          ...defaultState,
          completions: [{ name: "apple", items: [] }],
        };
        const nextState = reducer(state, selectNext());
        expect(nextState.select).equals(-1);
      });
    });

    context("when completions exist", () => {
      it("selects next selection", () => {
        let state: State = {
          ...defaultState,
          select: -1,
          completions: [
            {
              name: "Apple",
              items: [{}, {}],
            },
            {
              name: "Banana",
              items: [{}],
            },
          ],
        };

        state = reducer(state, selectNext());
        expect(state.select).equals(0);

        state = reducer(state, selectNext());
        expect(state.select).equals(1);

        state = reducer(state, selectNext());
        expect(state.select).equals(2);

        state = reducer(state, selectNext());
        expect(state.select).equals(-1);
      });
    });
  });

  describe("selectPrev", () => {
    context("when no completion groups", () => {
      it("does nothing", () => {
        const nextState = reducer(defaultState, selectPrev());
        expect(nextState.select).equals(-1);
      });

      context("when no completion items", () => {
        it("does nothing", () => {
          const state = {
            ...defaultState,
            completions: [{ name: "apple", items: [] }],
          };
          const nextState = reducer(state, selectPrev());
          expect(nextState.select).equals(-1);
        });
      });
    });

    context("when completions exist", () => {
      it("selects a previous completion", () => {
        let state: State = {
          ...defaultState,
          select: -1,
          completions: [
            {
              name: "Apple",
              items: [{}, {}],
            },
            {
              name: "Banana",
              items: [{}],
            },
          ],
        };

        state = reducer(state, selectPrev());
        expect(state).to.have.property("select", 2);

        state = reducer(state, selectPrev());
        expect(state).to.have.property("select", 1);

        state = reducer(state, selectPrev());
        expect(state).to.have.property("select", 0);

        state = reducer(state, selectPrev());
        expect(state).to.have.property("select", -1);
      });
    });
  });
});
