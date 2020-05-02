import CommandLineParser, {
  InputPhase,
} from "../../../src/console/commandline/CommandLineParser";
import { Command } from "../../../src/shared/Command";
import { expect } from "chai";

describe("CommandLineParser", () => {
  describe("#inputPhase", () => {
    it("returns parsed command-line", () => {
      const sut = new CommandLineParser();
      expect(sut.inputPhase("")).to.equal(InputPhase.OnCommand);
      expect(sut.inputPhase("op")).to.equal(InputPhase.OnCommand);
      expect(sut.inputPhase("open ")).to.equal(InputPhase.OnArgs);
      expect(sut.inputPhase("open apple")).to.equal(InputPhase.OnArgs);
    });
  });
  describe("#parse", () => {
    it("returns parsed command-line", () => {
      const sut = new CommandLineParser();
      expect(sut.parse("open google  apple")).to.deep.equal({
        command: Command.Open,
        args: "google  apple",
      });

      expect(sut.parse("qa")).to.deep.equal({
        command: Command.QuitAll,
        args: "",
      });
    });
  });
});
