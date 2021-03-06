import * as consoleActions from "../../../src/console/app/actions";
import {
  HIDE,
  HIDE_COMMAND,
  SHOW_COMMAND,
  SHOW_ERROR,
  SHOW_FIND,
  SHOW_INFO,
} from "../../../src/console/app/actions";
import { expect } from "chai";

import browserFake from "webextensions-api-fake";

describe("console actions", () => {
  beforeEach(() => {
    (global as any).browser = browserFake();
  });

  describe("hide", () => {
    it("create CONSOLE_HIDE action", () => {
      const action = consoleActions.hide();
      expect(action.type).to.equal(HIDE);
    });
  });
  describe("showCommand", () => {
    it("create CONSOLE_SHOW_COMMAND action", async () => {
      const action = await consoleActions.showCommand("hello");
      expect(action.type).to.equal(SHOW_COMMAND);
      expect(action.text).to.equal("hello");
    });
  });

  describe("showFind", () => {
    it("create CONSOLE_SHOW_FIND action", () => {
      const action = consoleActions.showFind();
      expect(action.type).to.equal(SHOW_FIND);
    });
  });

  describe("showError", () => {
    it("create CONSOLE_SHOW_ERROR action", () => {
      const action = consoleActions.showError("an error");
      expect(action.type).to.equal(SHOW_ERROR);
      expect(action.text).to.equal("an error");
    });
  });

  describe("showInfo", () => {
    it("create CONSOLE_SHOW_INFO action", () => {
      const action = consoleActions.showInfo("an info");
      expect(action.type).to.equal(SHOW_INFO);
      expect(action.text).to.equal("an info");
    });
  });

  describe("hideCommand", () => {
    it("create CONSOLE_HIDE_COMMAND action", () => {
      const action = consoleActions.hideCommand();
      expect(action.type).to.equal(HIDE_COMMAND);
    });
  });
});
