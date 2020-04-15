import * as actions from "../../../src/console/actions";
import reducer, { State } from "../../../src/console/reducers";
import { expect } from "chai";
import CompletionType from "../../../src/shared/CompletionType";
import { ConsoleAction } from "../../../src/console/actions";

describe("console reducer", () => {
  it("return the initial state", () => {
    const state = reducer(undefined, {} as any);
    expect(state).to.have.property("mode", "");
    expect(state).to.have.property("messageText", "");
    expect(state).to.have.property("consoleText", "");
    expect(state).to.have.deep.property("completions", []);
    expect(state).to.have.property("select", -1);
  });

  it("return next state for CONSOLE_HIDE", () => {
    const initialState = reducer(undefined, {} as any);
    const action: actions.ConsoleAction = { type: actions.CONSOLE_HIDE };
    const state = reducer({ ...initialState, mode: "error" }, action);
    expect(state).to.have.property("mode", "");
  });

  it("return next state for CONSOLE_SHOW_COMMAND", () => {
    const action: actions.ConsoleAction = {
      type: actions.CONSOLE_SHOW_COMMAND,
      completionTypes: [CompletionType.SearchEngines, CompletionType.History],
      text: "open ",
    };
    const state = reducer(undefined, action);
    expect(state).to.have.property("mode", "command");
    expect(state).to.have.property("consoleText", "open ");
  });

  it("return next state for CONSOLE_SHOW_INFO", () => {
    const action: actions.ConsoleAction = {
      type: actions.CONSOLE_SHOW_INFO,
      text: "an info",
    };
    const state = reducer(undefined, action);
    expect(state).to.have.property("mode", "info");
    expect(state).to.have.property("messageText", "an info");
  });

  it("return next state for CONSOLE_SHOW_ERROR", () => {
    const action: actions.ConsoleAction = {
      type: actions.CONSOLE_SHOW_ERROR,
      text: "an error",
    };
    const state = reducer(undefined, action);
    expect(state).to.have.property("mode", "error");
    expect(state).to.have.property("messageText", "an error");
  });

  it("return next state for CONSOLE_HIDE_COMMAND", () => {
    const initialState = reducer(undefined, {} as any);
    const action: actions.ConsoleAction = {
      type: actions.CONSOLE_HIDE_COMMAND,
    };
    let state = reducer({ ...initialState, mode: "command" }, action);
    expect(state).to.have.property("mode", "");

    state = reducer({ ...initialState, mode: "error" }, action);
    expect(state).to.have.property("mode", "error");
  });

  it("return next state for CONSOLE_SET_CONSOLE_TEXT", () => {
    const action: actions.ConsoleAction = {
      type: actions.CONSOLE_SET_CONSOLE_TEXT,
      consoleText: "hello world",
    };
    const state = reducer(undefined, action);

    expect(state).to.have.property("consoleText", "hello world");
  });

  it("return next state for CONSOLE_SET_COMPLETIONS", () => {
    const initialState = reducer(undefined, {} as any);
    let state: State = {
      ...initialState,
      select: 0,
      completions: [],
    };
    const action: actions.ConsoleAction = {
      type: actions.CONSOLE_SET_COMPLETIONS,
      completions: [
        {
          name: "Apple",
          items: [{}, {}, {}],
        },
        {
          name: "Banana",
          items: [{}, {}, {}],
        },
      ],
      completionSource: "",
    };
    state = reducer(state, action);
    expect(state).to.have.property("completions", action.completions);
    expect(state).to.have.property("select", -1);
  });

  it("return next state for CONSOLE_COMPLETION_NEXT", () => {
    const initialState = reducer(undefined, {} as any);
    const action: ConsoleAction = { type: actions.CONSOLE_COMPLETION_NEXT };
    let state = {
      ...initialState,
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

    state = reducer(state, action);
    expect(state).to.have.property("select", 0);

    state = reducer(state, action);
    expect(state).to.have.property("select", 1);

    state = reducer(state, action);
    expect(state).to.have.property("select", 2);

    state = reducer(state, action);
    expect(state).to.have.property("select", -1);
  });

  it("return next state for CONSOLE_COMPLETION_PREV", () => {
    const initialState = reducer(undefined, {} as any);
    const action: ConsoleAction = { type: actions.CONSOLE_COMPLETION_PREV };
    let state = {
      ...initialState,
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

    state = reducer(state, action);
    expect(state).to.have.property("select", 2);

    state = reducer(state, action);
    expect(state).to.have.property("select", 1);

    state = reducer(state, action);
    expect(state).to.have.property("select", 0);

    state = reducer(state, action);
    expect(state).to.have.property("select", -1);
  });
});
