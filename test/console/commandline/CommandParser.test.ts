import CommandParser, {
  UnknownCommandError,
} from "../../../src/console/commandline/CommandParser";
import { Command } from "../../../src/shared/Command";

describe("CommandParser", () => {
  describe("#parse", () => {
    it("returns matched command with the string", () => {
      const sut = new CommandParser();
      expect(sut.parse("open")).toEqual(Command.Open);
      expect(sut.parse("w")).toEqual(Command.WindowOpen);
      expect(sut.parse("bdelete!")).toEqual(Command.BufferDeleteForce);
      expect(() => sut.parse("harakiri")).toThrow(UnknownCommandError);
    });
  });
});
