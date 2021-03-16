import { injectable } from "tsyringe";
import CommandUseCase from "../usecases/CommandUseCase";

const trimStart = (str: string): string => {
  // NOTE String.trimStart is available on Firefox 61
  return str.replace(/^\s+/, "");
};

@injectable()
export default class CommandController {
  constructor(private commandIndicator: CommandUseCase) {}

  // eslint-disable-next-line complexity
  exec(line: string): Promise<unknown> {
    const trimmed = trimStart(line);
    const words = trimmed.split(/ +/);
    const name = words[0];
    if (words[0].length === 0) {
      return Promise.resolve();
    }

    const keywords = trimStart(trimmed.slice(name.length));
    switch (words[0]) {
      case "o":
      case "open":
        return this.commandIndicator.open(keywords);
      case "t":
      case "tabopen":
        return this.commandIndicator.tabopen(keywords);
      case "w":
      case "winopen":
        return this.commandIndicator.winopen(keywords);
      case "b":
      case "buffer":
        return this.commandIndicator.buffer(keywords);
      case "bd":
      case "bdel":
      case "bdelete":
        return this.commandIndicator.bdelete(false, keywords);
      case "bd!":
      case "bdel!":
      case "bdelete!":
        return this.commandIndicator.bdelete(true, keywords);
      case "bdeletes":
        return this.commandIndicator.bdeletes(false, keywords);
      case "bdeletes!":
        return this.commandIndicator.bdeletes(true, keywords);
      case "addbookmark":
        return this.commandIndicator.addbookmark(keywords);
      case "q":
      case "quit":
        return this.commandIndicator.quit();
      case "qa":
      case "quitall":
        return this.commandIndicator.quitAll();
      case "set":
        return this.commandIndicator.set(keywords);
      case "h":
      case "help":
        return this.commandIndicator.help();
    }
    throw new Error(words[0] + " command is not defined");
  }
}
