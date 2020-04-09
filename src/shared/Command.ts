export enum Command {
    Open = "open",
    TabOpen = "tabopen",
    WindowOpen = "winopen",
    Buffer = "buffer",
    BufferDelete = "bdelete",
    BufferDeleteForce = "bdelete!",
    BuffersDelete = "bdeletes",
    BuffersDeleteForce = "bdeletes!",
    AddBookmark = "addbookmark",
    Quit = "quit",
    QuitAll = "quitall",
    Set = "set",
    Help = "help",
}

export namespace Command {
  export function members(): Command[] {
    return [
      Command.Open ,
      Command.TabOpen ,
      Command.WindowOpen ,
      Command.Buffer ,
      Command.BufferDelete ,
      Command.BufferDeleteForce ,
      Command.BuffersDelete ,
      Command.BuffersDeleteForce ,
      Command.AddBookmark ,
      Command.Quit ,
      Command.QuitAll ,
      Command.Set ,
      Command.Help ,
    ]
  }

  export function valueOf(value: string): Command {
    const map = new Map(members().map(cmd => [cmd.toString(), cmd]));
    const cmd = map.get(value);
    if (!cmd) {
      throw new Error(`unknown command '${value}`);
    }
    return cmd;
  }
}
