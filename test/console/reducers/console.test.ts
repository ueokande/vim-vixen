import * as actions from "console/actions";
import reducer from "console/reducers";

describe("console reducer", () => {
  it("return the initial state", () => {
    const state = reducer(undefined, {});
    expect(state).to.have.property("mode", "");
    expect(state).to.have.property("messageText", "");
    expect(state).to.have.property("consoleText", "");
    expect(state).to.have.deep.property("completions", []);
    expect(state).to.have.property("select", -1);
  });

  it("return next state for CONSOLE_HIDE", () => {
    const action = { type: actions.CONSOLE_HIDE };
    const state = reducer({ mode: "error" }, action);
    expect(state).to.have.property("mode", "");
  });

  it("return next state for CONSOLE_SHOW_COMMAND", () => {
    const action = { type: actions.CONSOLE_SHOW_COMMAND, text: "open " };
    const state = reducer({}, action);
    expect(state).to.have.property("mode", "command");
    expect(state).to.have.property("consoleText", "open ");
  });

  it("return next state for CONSOLE_SHOW_INFO", () => {
    const action = { type: actions.CONSOLE_SHOW_INFO, text: "an info" };
    const state = reducer({}, action);
    expect(state).to.have.property("mode", "info");
    expect(state).to.have.property("messageText", "an info");
  });

  it("return next state for CONSOLE_SHOW_ERROR", () => {
    const action = { type: actions.CONSOLE_SHOW_ERROR, text: "an error" };
    const state = reducer({}, action);
    expect(state).to.have.property("mode", "error");
    expect(state).to.have.property("messageText", "an error");
  });

  it("return next state for CONSOLE_HIDE_COMMAND", () => {
    const action = { type: actions.CONSOLE_HIDE_COMMAND };
    let state = reducer({ mode: "command" }, action);
    expect(state).to.have.property("mode", "");

    state = reducer({ mode: "error" }, action);
    expect(state).to.have.property("mode", "error");
  });

  it("return next state for CONSOLE_SET_CONSOLE_TEXT", () => {
    const action = {
      type: actions.CONSOLE_SET_CONSOLE_TEXT,
      consoleText: "hello world",
    };
    const state = reducer({}, action);

    expect(state).to.have.property("consoleText", "hello world");
  });

  it("return next state for CONSOLE_SET_COMPLETIONS", () => {
    let state = {
      select: 0,
      completions: [],
    };
    const action = {
      type: actions.CONSOLE_SET_COMPLETIONS,
      completions: [
        {
          name: "Apple",
          items: [1, 2, 3],
        },
        {
          name: "Banana",
          items: [4, 5, 6],
        },
      ],
    };
    state = reducer(state, action);
    expect(state).to.have.property("completions", action.completions);
    expect(state).to.have.property("select", -1);
  });

  it("return next state for CONSOLE_COMPLETION_NEXT", () => {
    const action = { type: actions.CONSOLE_COMPLETION_NEXT };
    let state = {
      select: -1,
      completions: [
        {
          name: "Apple",
          items: [1, 2],
        },
        {
          name: "Banana",
          items: [3],
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
    const action = { type: actions.CONSOLE_COMPLETION_PREV };
    let state = {
      select: -1,
      completions: [
        {
          name: "Apple",
          items: [1, 2],
        },
        {
          name: "Banana",
          items: [3],
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
