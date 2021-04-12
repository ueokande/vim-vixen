import { expect } from "chai";
import reducer, { defaultState, State } from "../../../src/console/app/recuer";
import {
  hide,
  hideCommand,
  showCommand,
  showError,
  showFind,
  showInfo,
} from "../../../src/console/app/actions";

describe("app reducer", () => {
  describe("hide", () => {
    it("switches to none mode", () => {
      const initialState: State = {
        ...defaultState,
        mode: "info",
      };
      const nextState = reducer(initialState, hide());

      expect(nextState.mode).to.be.empty;
    });
  });

  describe("showCommand", () => {
    it("switches to command mode with a message", () => {
      const nextState = reducer(defaultState, showCommand("open "));

      expect(nextState.mode).equals("command");
      expect(nextState.consoleText).equals("open ");
    });
  });

  describe("showFind", () => {
    it("switches to find mode with a message", () => {
      const nextState = reducer(defaultState, showFind());

      expect(nextState.mode).equals("find");
    });
  });

  describe("showError", () => {
    it("switches to error message mode with a message", () => {
      const nextState = reducer(defaultState, showError("error occurs"));

      expect(nextState.mode).equals("error");
      expect(nextState.messageText).equals("error occurs");
    });
  });

  describe("showInfo", () => {
    it("switches to info message mode with a message", () => {
      const nextState = reducer(defaultState, showInfo("what's up"));

      expect(nextState.mode).equals("info");
      expect(nextState.messageText).equals("what's up");
    });
  });

  describe("hideCommand", () => {
    describe("when command mode", () => {
      it("switches to none mode", () => {
        const initialState: State = {
          ...defaultState,
          mode: "command",
        };
        const nextState = reducer(initialState, hideCommand());

        expect(nextState.mode).to.be.empty;
      });
    });

    describe("when info message mode", () => {
      it("does nothing", () => {
        const initialState: State = {
          ...defaultState,
          mode: "info",
        };
        const nextState = reducer(initialState, hideCommand());

        expect(nextState.mode).equals("info");
      });
    });
  });
});
