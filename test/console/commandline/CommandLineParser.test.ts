import CommandLineParser, {
  InputPhase,
} from "../../../src/console/commandline/CommandLineParser";
import { Command } from "../../../src/shared/Command";

describe("CommandLineParser", () => {
  describe("#inputPhase", () => {
    it("returns parsed command-line", () => {
      const sut = new CommandLineParser();
      expect(sut.inputPhase("")).toEqual(InputPhase.OnCommand);
      expect(sut.inputPhase("op")).toEqual(InputPhase.OnCommand);
      expect(sut.inputPhase("open ")).toEqual(InputPhase.OnArgs);
      expect(sut.inputPhase("open apple")).toEqual(InputPhase.OnArgs);
    });
  });
  describe("#parse", () => {
    it("returns parsed command-line", () => {
      const sut = new CommandLineParser();
      expect(sut.parse("open google  apple")).toEqual({
        command: Command.Open,
        args: "google  apple",
      });

      expect(sut.parse("qa")).toEqual({
        command: Command.QuitAll,
        args: "",
      });
    });
  });
});
