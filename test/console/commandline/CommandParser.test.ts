import CommandParser, { UnknownCommandError } from "../../../src/console/commandline/CommandParser";
import { Command } from "../../../src/shared/Command";
import { expect } from "chai"

describe("CommandParser", () => {
  describe("#parse", () => {
    it("returns matched command with the string", () => {
      const sut = new CommandParser();
      expect(sut.parse("open")).to.equal(Command.Open);
      expect(sut.parse("w")).to.equal(Command.WindowOpen);
      expect(sut.parse("bdelete!")).to.equal(Command.BufferDeleteForce);
      expect(() => sut.parse("harakiri")).to.throw(UnknownCommandError);
    })
  })
});
