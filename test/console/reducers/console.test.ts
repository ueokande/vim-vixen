import * as actions from "../../../src/console/actions";
import reducer from "../../../src/console/reducers/console";
import { expect } from "chai";

describe("console reducer", () => {
  it("return the initial state", () => {
    const state = reducer(undefined, {} as any);
    expect(state).to.have.property("mode", "");
    expect(state).to.have.property("messageText", "");
    expect(state).to.have.property("consoleText", "");
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
});
