import CommandParser from "./CommandParser";
import { Command } from "../../shared/Command";

export type CommandLine = {
  readonly command: Command,
  readonly args: string
}

export enum InputPhase {
  OnCommand,
  OnArgs,
}

export default class CommandLineParser {
  private commandParser: CommandParser = new CommandParser();

  inputPhase(line: string): InputPhase {
    line = line.trimLeft();
    if (line.length == 0) {
      return InputPhase.OnCommand
    }
    const command = line.split(/\s+/, 1)[0];
    if (line.length == command.length) {
      return InputPhase.OnCommand
    }
    return InputPhase.OnArgs;
  }

  parse(line: string): CommandLine {
    const trimLeft = line.trimLeft();
    const command = trimLeft.split(/\s+/, 1)[0];
    const args = trimLeft.slice(command.length).trimLeft();
    return {
      command: this.commandParser.parse(command),
      args: args,
    }
  }
}
